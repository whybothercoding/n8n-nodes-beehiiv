import { INodeProperties } from 'n8n-workflow';
import {
	beehiivListPagination,
	mergeAdditionalFields,
	paginationFields,
	parseJsonBodyField,
	splitCommaList,
	unwrapDataProperty,
} from '../../shared/GenericFunctions';

const customFieldsField: INodeProperties = {
	displayName: 'Custom Fields',
	name: 'customFields',
	type: 'fixedCollection',
	typeOptions: { multipleValues: true },
	displayOptions: {
		show: { resource: ['subscription'], operation: ['update', 'updateByEmail', 'create'] },
	},
	default: {},
	options: [
		{
			name: 'fields',
			displayName: 'Field',
			values: [
				{ displayName: 'Name', name: 'name', type: 'string', default: '', description: 'Custom field name' },
				{ displayName: 'Value', name: 'value', type: 'string', default: '', description: 'Custom field value' },
			],
		},
	],
	description: 'Custom fields to set on the subscription. The fields must already exist for the publication.',
};

export const subscriptionDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['subscription'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new subscription',
				action: 'Create a subscription',
				routing: {
					request: {
						method: 'POST',
						url: '=/publications/{{$parameter["publicationId"]}}/subscriptions',
						body: {
							email: '={{$parameter["email"]}}',
							custom_fields: '={{$parameter["customFields"]["fields"]}}',
						},
					},
					send: {
						preSend: [mergeAdditionalFields('additionalFields')],
					},
					output: {
						postReceive: [unwrapDataProperty],
					},
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a subscription',
				action: 'Delete a subscription',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/publications/{{$parameter["publicationId"]}}/subscriptions/{{$parameter["subscriptionId"]}}',
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a subscription',
				action: 'Get a subscription',
				routing: {
					request: {
						method: 'GET',
						url: '=/publications/{{$parameter["publicationId"]}}/subscriptions/{{$parameter["subscriptionId"]}}',
					},
					output: {
						postReceive: [unwrapDataProperty],
					},
				},
			},
			{
				name: 'Get by Email',
				value: 'getByEmail',
				description: 'Get a subscription by email',
				action: 'Get a subscription by email',
				routing: {
					request: {
						method: 'GET',
						url: '=/publications/{{$parameter["publicationId"]}}/subscriptions/by_email/{{encodeURIComponent($parameter["email"])}}',
					},
					output: {
						postReceive: [unwrapDataProperty],
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Retrieve many subscriptions',
				action: 'Get many subscriptions',
				routing: {
					request: {
						method: 'GET',
						url: '=/publications/{{$parameter["publicationId"]}}/subscriptions',
					},
					operations: {
						pagination: beehiivListPagination,
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a subscription',
				action: 'Update a subscription',
				routing: {
					request: {
						method: 'PUT',
						url: '=/publications/{{$parameter["publicationId"]}}/subscriptions/{{$parameter["subscriptionId"]}}',
						body: {
							custom_fields: '={{$parameter["customFields"]["fields"]}}',
						},
					},
					send: {
						preSend: [mergeAdditionalFields('updateFields')],
					},
					output: {
						postReceive: [unwrapDataProperty],
					},
				},
			},
			{
				name: 'Update by Email',
				value: 'updateByEmail',
				description: 'Update a subscription by email address',
				action: 'Update a subscription by email',
				routing: {
					request: {
						method: 'PUT',
						url: '=/publications/{{$parameter["publicationId"]}}/subscriptions/by_email/{{encodeURIComponent($parameter["emailToUpdate"])}}',
						body: {
							custom_fields: '={{$parameter["customFields"]["fields"]}}',
						},
					},
					send: {
						preSend: [mergeAdditionalFields('updateFields')],
					},
					output: {
						postReceive: [unwrapDataProperty],
					},
				},
			},
			{
				name: 'Add Tag',
				value: 'addTag',
				description: 'Add tags to a subscription',
				action: 'Add a tag to a subscription',
				routing: {
					// Beehiiv's tag endpoint takes a "tags" array, not a single "tag" string.
					request: {
						method: 'POST',
						url: '=/publications/{{$parameter["publicationId"]}}/subscriptions/{{$parameter["subscriptionId"]}}/tags',
					},
					send: {
						preSend: [splitCommaList('tags')],
					},
					output: {
						postReceive: [unwrapDataProperty],
					},
				},
			},
			{
				name: 'Bulk Create',
				value: 'bulkCreate',
				description: 'Create multiple subscriptions in bulk',
				action: 'Bulk create subscriptions',
				routing: {
					// The bulk endpoint lives at /bulk_subscriptions, not /subscriptions/bulk.
					request: {
						method: 'POST',
						url: '=/publications/{{$parameter["publicationId"]}}/bulk_subscriptions',
					},
					send: {
						preSend: [parseJsonBodyField('subscriptions')],
					},
				},
			},
			{
				name: 'Bulk Update',
				value: 'bulkUpdate',
				description: 'Update multiple subscriptions in bulk',
				action: 'Bulk update subscriptions',
				routing: {
					// The bulk update endpoint lives at /subscriptions/bulk_actions, not /subscriptions/bulk.
					// Setting "unsubscribe" or "tier" per item (see the Subscriptions (JSON) field) covers
					// what a separate "bulk update status" endpoint would have done.
					request: {
						method: 'PUT',
						url: '=/publications/{{$parameter["publicationId"]}}/subscriptions/bulk_actions',
					},
					send: {
						preSend: [parseJsonBodyField('bulkUpdateItems', 'subscriptions')],
					},
				},
			},
			{
				name: 'List Bulk Updates',
				value: 'listBulkUpdates',
				description: 'Retrieve bulk subscription update records',
				action: 'List bulk subscription updates',
				routing: {
					request: {
						method: 'GET',
						url: '=/publications/{{$parameter["publicationId"]}}/bulk_subscription_updates',
					},
					operations: {
						pagination: beehiivListPagination,
					},
				},
			},
			{
				name: 'Get Bulk Update',
				value: 'getBulkUpdate',
				description: 'Get a specific bulk subscription update record',
				action: 'Get a bulk subscription update',
				routing: {
					request: {
						method: 'GET',
						url: '=/publications/{{$parameter["publicationId"]}}/bulk_subscription_updates/{{$parameter["bulkUpdateId"]}}',
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
				resource: ['subscription'],
			},
		},
		default: '',
		description: 'The ID of the publication',
	},
	{
		displayName: 'Subscription ID',
		name: 'subscriptionId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['subscription'],
				operation: ['get', 'delete', 'update', 'addTag'],
			},
		},
		default: '',
		description: 'The ID of the subscription',
	},
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'name@email.com',
		required: true,
		displayOptions: {
			show: {
				resource: ['subscription'],
				operation: ['create', 'getByEmail'],
			},
		},
		default: '',
		description: 'The email address of the subscriber',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: ['subscription'], operation: ['create'] },
		},
		options: [
			{
				displayName: 'Double Opt Override',
				name: 'double_opt_override',
				type: 'options',
				options: [
					{ name: 'Not Set', value: 'not_set' },
					{ name: 'On', value: 'on' },
					{ name: 'Off', value: 'off' },
				],
				default: 'not_set',
			},
			{
				displayName: 'Reactivate Existing',
				name: 'reactivate_existing',
				type: 'boolean',
				default: false,
				description: 'Whether to reactivate an existing subscription',
			},
			{ displayName: 'Referral Code', name: 'referral_code', type: 'string', default: '' },
			{ displayName: 'Referring Site', name: 'referring_site', type: 'string', default: '' },
			{
				displayName: 'Send Welcome Email',
				name: 'send_welcome_email',
				type: 'boolean',
				default: false,
				description: 'Whether to send a welcome email',
			},
			{
				displayName: 'Stripe Customer ID',
				name: 'stripe_customer_id',
				type: 'string',
				default: '',
			},
			{ displayName: 'UTM Campaign', name: 'utm_campaign', type: 'string', default: '' },
			{ displayName: 'UTM Medium', name: 'utm_medium', type: 'string', default: '' },
			{ displayName: 'UTM Source', name: 'utm_source', type: 'string', default: '' },
		],
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: ['subscription'], operation: ['update', 'updateByEmail'] },
		},
		options: [
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				default: '',
				description: 'New email address for the subscriber',
			},
			{
				displayName: 'Stripe Customer ID',
				name: 'stripe_customer_id',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Unsubscribe',
				name: 'unsubscribe',
				type: 'boolean',
				default: false,
				description: 'Whether to unsubscribe the user',
			},
			{
				displayName: 'Tier',
				name: 'tier',
				type: 'options',
				options: [
					{ name: 'Free', value: 'free' },
					{ name: 'Premium', value: 'premium' },
				],
				default: 'free',
			},
		],
	},
	customFieldsField,
	{
		displayName: 'Email to Update',
		name: 'emailToUpdate',
		type: 'string',
		placeholder: 'name@email.com',
		required: true,
		displayOptions: {
			show: { resource: ['subscription'], operation: ['updateByEmail'] },
		},
		default: '',
		description: 'The email address of the subscriber to update',
	},
	{
		displayName: 'Tags',
		name: 'tags',
		type: 'string',
		required: true,
		displayOptions: {
			show: { resource: ['subscription'], operation: ['addTag'] },
		},
		default: '',
		description: 'Comma-separated list of tags to add to the subscription',
		placeholder: 'newsletter,vip',
	},
	{
		displayName: 'Subscriptions (JSON)',
		name: 'subscriptions',
		type: 'json',
		required: true,
		displayOptions: {
			show: { resource: ['subscription'], operation: ['bulkCreate'] },
		},
		default: '[]',
		description: 'Array of subscription objects to create. Each object should have at least an "email" field. Example: [{"email":"user@example.com","reactivate_existing":false}]',
	},
	{
		displayName: 'Subscriptions (JSON)',
		name: 'bulkUpdateItems',
		type: 'json',
		required: true,
		displayOptions: {
			show: { resource: ['subscription'], operation: ['bulkUpdate'] },
		},
		default: '[]',
		description: 'Array of subscription update objects. Each must have a "subscription_id" and optional fields: email, stripe_customer_id, unsubscribe, tier, custom_fields. Example: [{"subscription_id":"sub_123","unsubscribe":true}]',
	},
	{
		displayName: 'Bulk Update ID',
		name: 'bulkUpdateId',
		type: 'string',
		required: true,
		displayOptions: {
			show: { resource: ['subscription'], operation: ['getBulkUpdate'] },
		},
		default: '',
		description: 'The ID of the bulk subscription update record',
	},
	...paginationFields('subscription', ['getAll', 'listBulkUpdates']),
];
