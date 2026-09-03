import { NodeOperationError } from 'n8n-workflow';
import type {
	DeclarativeRestApiSettings,
	IDataObject,
	IExecutePaginationFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
	INodeProperties,
	PreSendAction,
} from 'n8n-workflow';

interface BeehiivListResponse {
	data?: IDataObject[];
	has_more?: boolean;
	next_cursor?: string;
}

/**
 * Beehiiv wraps every list response as `{ data: [...], has_more, next_cursor }` — these
 * pagination fields are flat siblings of `data`, NOT nested under a "pagination" key
 * (verified against https://developers.beehiiv.com/api-reference/subscriptions/index and
 * .../posts/index, 2026-09-03; cursor-based pagination, capped at limit=100/page). This walks
 * pages until either the caller's Limit is reached or the API reports no more pages, returning
 * one n8n item per record instead of a single item holding the whole envelope.
 */
export async function beehiivListPagination(
	this: IExecutePaginationFunctions,
	requestOptions: DeclarativeRestApiSettings.ResultOptions,
): Promise<INodeExecutionData[]> {
	const returnAll = this.getNodeParameter('returnAll', false) as boolean;
	const limit = returnAll ? Infinity : (this.getNodeParameter('limit', 50) as number);

	const aggregated: INodeExecutionData[] = [];
	let cursor: string | undefined;
	let hasMorePages = true;

	while (hasMorePages) {
		const pageSize = Math.max(1, Math.min(100, limit - aggregated.length));
		const options = {
			...requestOptions.options,
			url: requestOptions.options.url as string,
			qs: {
				...(requestOptions.options.qs as IDataObject | undefined),
				limit: pageSize,
				...(cursor ? { cursor } : {}),
			},
		} as unknown as IHttpRequestOptions;

		const response = (await this.helpers.httpRequestWithAuthentication.call(
			this,
			'beehiivApi',
			options,
		)) as BeehiivListResponse;

		for (const item of response.data ?? []) {
			aggregated.push({ json: item });
			if (aggregated.length >= limit) break;
		}

		cursor = response.next_cursor;
		hasMorePages = aggregated.length < limit && !!response.has_more && !!cursor;
	}

	return aggregated;
}

/** Standard n8n "Return All" + "Limit" pair, scoped to one resource's list-style operations. */
export function paginationFields(resource: string, operations: string[]): INodeProperties[] {
	return [
		{
			displayName: 'Return All',
			name: 'returnAll',
			type: 'boolean',
			default: false,
			description: 'Whether to return all results or only up to a given limit',
			displayOptions: {
				show: { resource: [resource], operation: operations },
			},
			routing: {
				// Without this, the routing engine never invokes operations.pagination
				// (beehiivListPagination) at all - it just does a single plain request and
				// returns Beehiiv's raw {data, page, limit, total_results, total_pages} envelope
				// as one item, regardless of Return All / Limit. See n8n-core's routing-node.js:
				// custom pagination only runs when requestData.paginate is true, which is only
				// ever set from a node property's own routing.send.paginate.
				send: {
					paginate: true,
				},
			},
		},
		{
			displayName: 'Limit',
			name: 'limit',
			type: 'number',
			default: 50,
			typeOptions: { minValue: 1 },
			description: 'Max number of results to return',
			displayOptions: {
				show: { resource: [resource], operation: operations, returnAll: [false] },
			},
		},
	];
}

/** Unwraps Beehiiv's single-record `{ data: {...} }` envelope so the output item is the record itself. */
export const unwrapDataProperty = {
	type: 'rootProperty' as const,
	properties: { property: 'data' },
};

/**
 * Merges an "Additional Fields" / "Update Fields" collection into the request body so only fields
 * the user actually filled in get sent — prevents create/update routing bodies from overwriting
 * existing values with a field's UI default (e.g. an untouched "Currency" resetting to "USD").
 */
export const mergeAdditionalFields = (paramName: string): PreSendAction =>
	async function (this, requestOptions) {
		const extra = this.getNodeParameter(paramName, {}) as IDataObject;
		requestOptions.body = { ...((requestOptions.body as IDataObject) ?? {}), ...extra };
		return requestOptions;
	};

/**
 * `json`-typed parameters are edited as raw text in the UI; resolving them through a routing
 * expression risks the value reaching the API as a JSON-encoded string instead of a real
 * array/object. Reading them via getNodeParameter + an explicit parse removes that ambiguity.
 */
export const parseJsonBodyField = (paramName: string, bodyKey: string = paramName): PreSendAction =>
	async function (this, requestOptions) {
		const raw = this.getNodeParameter(paramName);
		let value: unknown = raw;
		if (typeof raw === 'string') {
			try {
				value = JSON.parse(raw);
			} catch (error) {
				throw new NodeOperationError(this.getNode(), `Invalid JSON in "${paramName}": ${(error as Error).message}`, {
					itemIndex: this.getItemIndex(),
				});
			}
		}
		requestOptions.body = { ...((requestOptions.body as IDataObject) ?? {}), [bodyKey]: value };
		return requestOptions;
	};

/**
 * For `json`-typed fields nested inside a `collection` (e.g. an "Additional Fields" entry) that
 * was already merged into the body as a raw string — parses it in place. Run this *after*
 * mergeAdditionalFields in the preSend array.
 */
export const parseBodyJsonStrings = (...bodyKeys: string[]): PreSendAction =>
	async function (this, requestOptions) {
		const body = (requestOptions.body as IDataObject) ?? {};
		for (const key of bodyKeys) {
			if (typeof body[key] === 'string') {
				try {
					body[key] = JSON.parse(body[key] as string);
				} catch (error) {
					throw new NodeOperationError(this.getNode(), `Invalid JSON in "${key}": ${(error as Error).message}`, {
						itemIndex: this.getItemIndex(),
					});
				}
			}
		}
		requestOptions.body = body;
		return requestOptions;
	};

/** Converts a comma-separated string field into a real string[] body value. */
export const splitCommaList = (paramName: string, bodyKey: string = paramName): PreSendAction =>
	async function (this, requestOptions) {
		const raw = this.getNodeParameter(paramName, '') as string;
		const value = raw
			.split(',')
			.map((entry) => entry.trim())
			.filter(Boolean);
		requestOptions.body = { ...((requestOptions.body as IDataObject) ?? {}), [bodyKey]: value };
		return requestOptions;
	};

interface TierPriceRow {
	id?: string;
	currency?: string;
	amountCents?: number;
	interval?: string;
	enabled?: boolean;
	intervalDisplay?: string;
	cta?: string;
	features?: string;
	delete?: boolean;
}

/**
 * Beehiiv prices a tier through `prices_attributes` (snake_case, array of price objects) rather
 * than the flat `price_cents`/`currency` fields this node used to send. Maps the `Prices`
 * fixedCollection UI rows onto that real shape; omits the key entirely when no price row was added,
 * since pricing is optional on both create and update.
 */
export const mapTierPrices = (
	paramName: string = 'pricesAttributes',
	bodyKey: string = 'prices_attributes',
): PreSendAction =>
	async function (this, requestOptions) {
		const raw = this.getNodeParameter(paramName, {}) as { fields?: TierPriceRow[] };
		const rows = raw.fields ?? [];
		if (rows.length) {
			const price_attributes = rows.map((row) => {
				const price: IDataObject = {
					currency: row.currency,
					amount_cents: row.amountCents,
					interval: row.interval,
				};
				if (row.id) price.id = row.id;
				if (row.intervalDisplay) price.interval_display = row.intervalDisplay;
				if (row.cta) price.cta = row.cta;
				if (typeof row.enabled === 'boolean') price.enabled = row.enabled;
				if (row.features) {
					price.features = row.features
						.split(',')
						.map((feature) => feature.trim())
						.filter(Boolean);
				}
				if (row.delete) price.delete = true;
				return price;
			});
			requestOptions.body = {
				...((requestOptions.body as IDataObject) ?? {}),
				[bodyKey]: price_attributes,
			};
		}
		return requestOptions;
	};
