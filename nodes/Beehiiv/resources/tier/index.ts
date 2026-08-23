import { INodeProperties } from 'n8n-workflow';
import {
	beehiivListPagination,
	mapTierPrices,
	mergeAdditionalFields,
	paginationFields,
	unwrapDataProperty,
} from '../../shared/GenericFunctions';

const pricesAttributesField: INodeProperties = {
	displayName: 'Prices',
	name: 'pricesAttributes',
	type: 'fixedCollection',
	typeOptions: { multipleValues: true },
	placeholder: 'Add Price',
	default: {},
	description:
		'Pricing options for this tier. Leave empty to leave existing prices untouched (update) or create a tier with no price (create).',
	displayOptions: {
		show: { resource: ['tier'], operation: ['create', 'update'] },
	},
	options: [
		{
			name: 'fields',
			displayName: 'Price',
			values: [
				{
					displayName: 'Price ID',
					name: 'id',
					type: 'string',
					default: '',
					description: 'Leave blank to add a new price. Set to update or (with Delete) remove an existing one.',
				},
				{
					displayName: 'Currency',
					name: 'currency',
					type: 'options',
					options: [
						{ name: 'AUD', value: 'aud' },
						{ name: 'BRL', value: 'brl' },
						{ name: 'CAD', value: 'cad' },
						{ name: 'DKK', value: 'dkk' },
						{ name: 'EUR', value: 'eur' },
						{ name: 'GBP', value: 'gbp' },
						{ name: 'INR', value: 'inr' },
						{ name: 'MXN', value: 'mxn' },
						{ name: 'NZD', value: 'nzd' },
						{ name: 'USD', value: 'usd' },
					],
					default: 'usd',
				},
				{
					displayName: 'Amount (Cents)',
					name: 'amountCents',
					type: 'number',
					default: 0,
					description: 'Price in cents (e.g. 999 = $9.99)',
				},
				{
					displayName: 'Interval',
					name: 'interval',
					type: 'options',
					options: [
						{ name: 'Month', value: 'month' },
						{ name: 'Quarter', value: 'quarter' },
						{ name: 'Year', value: 'year' },
						{ name: 'One Time', value: 'one_time' },
						{ name: 'Donation', value: 'donation' },
					],
					default: 'month',
				},
				{
					displayName: 'Enabled',
					name: 'enabled',
					type: 'boolean',
					default: true,
				},
				{
					displayName: 'Interval Display',
					name: 'intervalDisplay',
					type: 'string',
					default: '',
					description: 'Custom label shown for the billing interval',
				},
				{
					displayName: 'CTA',
					name: 'cta',
					type: 'string',
					default: '',
					description: 'Button text for external Stripe checkout',
				},
				{
					displayName: 'Features',
					name: 'features',
					type: 'string',
					default: '',
					description: 'Comma-separated list of feature descriptions',
					placeholder: 'Weekly bonus issue, Private community access',
				},
				{
					displayName: 'Delete',
					name: 'delete',
					type: 'boolean',
					default: false,
					description: 'Whether to delete this price (update only, requires Price ID)',
				},
			],
		},
	],
};

export const tierDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['tier'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new tier',
				action: 'Create a tier',
				routing: {
					// Beehiiv prices a tier through "prices_attributes" (see mapTierPrices), not
					// flat price_cents/currency fields.
					request: {
						method: 'POST',
						url: '=/publications/{{$parameter["publicationId"]}}/tiers',
						body: {
							name: '={{$parameter["name"]}}',
						},
					},
					send: {
						preSend: [mergeAdditionalFields('additionalFields'), mapTierPrices()],
					},
					output: {
						postReceive: [unwrapDataProperty],
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a tier',
				action: 'Get a tier',
				routing: {
					request: {
						method: 'GET',
						url: '=/publications/{{$parameter["publicationId"]}}/tiers/{{$parameter["tierId"]}}',
					},
					output: {
						postReceive: [unwrapDataProperty],
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Retrieve many tiers',
				action: 'Get many tiers',
				routing: {
					request: {
						method: 'GET',
						url: '=/publications/{{$parameter["publicationId"]}}/tiers',
					},
					operations: {
						pagination: beehiivListPagination,
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a tier',
				action: 'Update a tier',
				routing: {
					request: {
						method: 'PATCH',
						url: '=/publications/{{$parameter["publicationId"]}}/tiers/{{$parameter["tierId"]}}',
					},
					send: {
						preSend: [mergeAdditionalFields('updateFields'), mapTierPrices()],
					},
					output: {
						postReceive: [unwrapDataProperty],
					},
				},
			},
		],
		default: 'getAll',
	},
	{
		displayName: 'Publication ID',
		name: 'publicationId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['tier'],
			},
		},
		default: '',
		description: 'The ID of the publication',
	},
	{
		displayName: 'Tier ID',
		name: 'tierId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['tier'],
				operation: ['get', 'update'],
			},
		},
		default: '',
		description: 'The ID of the tier',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['tier'],
				operation: ['create'],
			},
		},
		default: '',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: ['tier'], operation: ['create'] },
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
			},
		],
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: ['tier'], operation: ['update'] },
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
			},
		],
	},
	pricesAttributesField,
	...paginationFields('tier', ['getAll']),
];
