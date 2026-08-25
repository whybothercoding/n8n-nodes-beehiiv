import { NodeOperationError } from 'n8n-workflow';
import type {
	DeclarativeRestApiSettings,
	IDataObject,
	IExecutePaginationFunctions,
	IExecuteSingleFunctions,
	IHttpRequestOptions,
	INode,
} from 'n8n-workflow';
import {
	beehiivListPagination,
	mapTierPrices,
	mergeAdditionalFields,
	parseBodyJsonStrings,
	parseJsonBodyField,
	splitCommaList,
} from './GenericFunctions';

type ParamMap = Record<string, unknown>;

const fakeNode = { name: 'Beehiiv', type: 'n8n-nodes-beehiiv.beehiiv' } as unknown as INode;

function fakeExecuteSingleContext(params: ParamMap): IExecuteSingleFunctions {
	return {
		getNodeParameter: (name: string, fallback?: unknown) =>
			name in params ? params[name] : fallback,
		getNode: () => fakeNode,
		getItemIndex: () => 0,
	} as unknown as IExecuteSingleFunctions;
}

function fakeRequestOptions(body: IDataObject): IHttpRequestOptions {
	return { body } as unknown as IHttpRequestOptions;
}

function fakePaginationContext(params: ParamMap, pages: unknown[]) {
	let call = 0;
	const calls: unknown[][] = [];
	const httpRequestMock = jest.fn((...args: unknown[]) => {
		calls.push(args);
		return Promise.resolve(pages[call++]);
	});
	const ctx = {
		getNodeParameter: (name: string, fallback?: unknown) =>
			name in params ? params[name] : fallback,
		helpers: {
			httpRequestWithAuthentication: {
				call: httpRequestMock,
			},
		},
	} as unknown as IExecutePaginationFunctions;
	return { ctx, httpRequestMock, calls };
}

describe('beehiivListPagination', () => {
	const baseRequestOptions = () =>
		({
			options: { url: 'https://api.beehiiv.com/v2/publications/pub_1/subscriptions', qs: {} },
		}) as unknown as DeclarativeRestApiSettings.ResultOptions;

	it('walks every page and flattens each record into its own item', async () => {
		const { ctx, httpRequestMock } = fakePaginationContext({ returnAll: true }, [
			{ data: [{ id: '1' }, { id: '2' }], pagination: { has_more: true, next_cursor: 'c1' } },
			{ data: [{ id: '3' }], pagination: { has_more: false } },
		]);

		const result = await beehiivListPagination.call(ctx, baseRequestOptions());

		expect(result).toEqual([{ json: { id: '1' } }, { json: { id: '2' } }, { json: { id: '3' } }]);
		expect(httpRequestMock).toHaveBeenCalledTimes(2);
	});

	it('stops as soon as the requested limit is reached, even mid-page', async () => {
		const { ctx, httpRequestMock } = fakePaginationContext({ returnAll: false, limit: 2 }, [
			{ data: [{ id: '1' }, { id: '2' }, { id: '3' }], pagination: { has_more: true, next_cursor: 'c1' } },
		]);

		const result = await beehiivListPagination.call(ctx, baseRequestOptions());

		expect(result).toHaveLength(2);
		expect(httpRequestMock).toHaveBeenCalledTimes(1);
	});

	it('stops when the API reports no further pages', async () => {
		const { ctx, httpRequestMock } = fakePaginationContext({ returnAll: true }, [
			{ data: [{ id: '1' }], pagination: { has_more: false, next_cursor: undefined } },
		]);

		const result = await beehiivListPagination.call(ctx, baseRequestOptions());

		expect(result).toEqual([{ json: { id: '1' } }]);
		expect(httpRequestMock).toHaveBeenCalledTimes(1);
	});

	it('forwards the cursor from one page to the next request', async () => {
		const { ctx, calls } = fakePaginationContext({ returnAll: true }, [
			{ data: [{ id: '1' }], pagination: { has_more: true, next_cursor: 'cursor-abc' } },
			{ data: [], pagination: { has_more: false } },
		]);

		await beehiivListPagination.call(ctx, baseRequestOptions());

		const secondCallOptions = calls[1][2] as unknown as IHttpRequestOptions;
		expect(secondCallOptions.qs?.cursor).toBe('cursor-abc');
	});
});

describe('mergeAdditionalFields', () => {
	it('merges only the fields present in the collection param into the body', async () => {
		const ctx = fakeExecuteSingleContext({ additionalFields: { subtitle: 'Hi', draft: true } });
		const requestOptions = fakeRequestOptions({ title: 'Post' });

		const result = await mergeAdditionalFields('additionalFields').call(ctx, requestOptions);

		expect(result.body).toEqual({ title: 'Post', subtitle: 'Hi', draft: true });
	});

	it('leaves the body unchanged when the collection is empty', async () => {
		const ctx = fakeExecuteSingleContext({});
		const requestOptions = fakeRequestOptions({ title: 'Post' });

		const result = await mergeAdditionalFields('additionalFields').call(ctx, requestOptions);

		expect(result.body).toEqual({ title: 'Post' });
	});
});

describe('parseJsonBodyField', () => {
	it('parses a JSON string parameter into a real array on the body', async () => {
		const ctx = fakeExecuteSingleContext({ subscriptions: '[{"email":"a@b.com"}]' });
		const requestOptions = fakeRequestOptions({});

		const result = await parseJsonBodyField('subscriptions').call(ctx, requestOptions);

		expect(result.body).toEqual({ subscriptions: [{ email: 'a@b.com' }] });
	});

	it('passes an already-parsed value through untouched', async () => {
		const ctx = fakeExecuteSingleContext({ subscriptions: [{ email: 'a@b.com' }] });
		const requestOptions = fakeRequestOptions({});

		const result = await parseJsonBodyField('subscriptions').call(ctx, requestOptions);

		expect(result.body).toEqual({ subscriptions: [{ email: 'a@b.com' }] });
	});

	it('writes under a different body key when one is given', async () => {
		const ctx = fakeExecuteSingleContext({ bulkUpdateItems: '[{"subscription_id":"s1"}]' });
		const requestOptions = fakeRequestOptions({});

		const result = await parseJsonBodyField('bulkUpdateItems', 'subscriptions').call(ctx, requestOptions);

		expect(result.body).toEqual({ subscriptions: [{ subscription_id: 's1' }] });
	});

	it('throws a NodeOperationError instead of a raw SyntaxError on malformed JSON', async () => {
		const ctx = fakeExecuteSingleContext({ subscriptions: '{not valid json' });
		const requestOptions = fakeRequestOptions({});

		await expect(parseJsonBodyField('subscriptions').call(ctx, requestOptions)).rejects.toThrow(
			NodeOperationError,
		);
	});
});

describe('parseBodyJsonStrings', () => {
	it('parses a JSON string already merged into the body', async () => {
		const ctx = fakeExecuteSingleContext({});
		const requestOptions = fakeRequestOptions({ blocks: '[{"type":"paragraph"}]' });

		const result = await parseBodyJsonStrings('blocks').call(ctx, requestOptions);

		expect(result.body).toEqual({ blocks: [{ type: 'paragraph' }] });
	});

	it('does nothing when the key is absent', async () => {
		const ctx = fakeExecuteSingleContext({});
		const requestOptions = fakeRequestOptions({ title: 'Post' });

		const result = await parseBodyJsonStrings('blocks').call(ctx, requestOptions);

		expect(result.body).toEqual({ title: 'Post' });
	});

	it('throws a NodeOperationError instead of a raw SyntaxError on malformed JSON', async () => {
		const ctx = fakeExecuteSingleContext({});
		const requestOptions = fakeRequestOptions({ blocks: '{not valid json' });

		await expect(parseBodyJsonStrings('blocks').call(ctx, requestOptions)).rejects.toThrow(
			NodeOperationError,
		);
	});
});

describe('splitCommaList', () => {
	it('trims whitespace and drops empty entries', async () => {
		const ctx = fakeExecuteSingleContext({ tags: 'newsletter,  vip ,,launch' });
		const requestOptions = fakeRequestOptions({});

		const result = await splitCommaList('tags').call(ctx, requestOptions);

		expect(result.body).toEqual({ tags: ['newsletter', 'vip', 'launch'] });
	});
});

describe('mapTierPrices', () => {
	it('maps UI rows onto Beehiiv\'s snake_case prices_attributes shape', async () => {
		const ctx = fakeExecuteSingleContext({
			pricesAttributes: {
				fields: [
					{
						currency: 'usd',
						amountCents: 999,
						interval: 'month',
						enabled: true,
						intervalDisplay: '/mo',
						cta: 'Subscribe',
						features: 'Bonus issue, Community access',
					},
				],
			},
		});
		const requestOptions = fakeRequestOptions({ name: 'Premium' });

		const result = await mapTierPrices().call(ctx, requestOptions);

		expect(result.body).toEqual({
			name: 'Premium',
			prices_attributes: [
				{
					currency: 'usd',
					amount_cents: 999,
					interval: 'month',
					enabled: true,
					interval_display: '/mo',
					cta: 'Subscribe',
					features: ['Bonus issue', 'Community access'],
				},
			],
		});
	});

	it('omits prices_attributes entirely when no price rows were added', async () => {
		const ctx = fakeExecuteSingleContext({ pricesAttributes: {} });
		const requestOptions = fakeRequestOptions({ name: 'Free' });

		const result = await mapTierPrices().call(ctx, requestOptions);

		expect(result.body).toEqual({ name: 'Free' });
	});

	it('includes id and delete only when set, for updating/removing an existing price', async () => {
		const ctx = fakeExecuteSingleContext({
			pricesAttributes: {
				fields: [{ id: 'price_123', currency: 'usd', amountCents: 500, interval: 'month', delete: true }],
			},
		});
		const requestOptions = fakeRequestOptions({});

		const result = await mapTierPrices().call(ctx, requestOptions);

		expect(result.body).toEqual({
			prices_attributes: [
				{ id: 'price_123', currency: 'usd', amount_cents: 500, interval: 'month', delete: true },
			],
		});
	});
});
