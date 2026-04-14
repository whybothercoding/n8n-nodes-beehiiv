import { INodeProperties } from 'n8n-workflow';

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
							reactivate_existing: '={{$parameter["reactivateExisting"]}}',
							send_welcome_email: '={{$parameter["sendWelcomeEmail"]}}',
							utm_source: '={{$parameter["utmSource"]}}',
							utm_medium: '={{$parameter["utmMedium"]}}',
							utm_campaign: '={{$parameter["utmCampaign"]}}',
							referring_site: '={{$parameter["referringSite"]}}',
							referral_code: '={{$parameter["referralCode"]}}',
							custom_fields: '={{$parameter["customFields"]["fields"]}}',
							tags: '={{$parameter["tags"]}}',
						},
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
						url: '=/publications/{{$parameter["publicationId"]}}/subscriptions/by_email/{{$parameter["email"]}}',
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
							email: '={{$parameter["updateEmail"]}}',
							stripe_customer_id: '={{$parameter["stripeCustomerId"]}}',
							unsubscribe: '={{$parameter["unsubscribe"]}}',
							custom_fields: '={{$parameter["customFields"]["fields"]}}',
						},
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
						url: '=/publications/{{$parameter["publicationId"]}}/subscriptions/by_email/{{$parameter["emailToUpdate"]}}',
						body: {
							email: '={{$parameter["updateEmail"]}}',
							stripe_customer_id: '={{$parameter["stripeCustomerId"]}}',
							unsubscribe: '={{$parameter["unsubscribe"]}}',
							custom_fields: '={{$parameter["customFields"]["fields"]}}',
						},
					},
				},
			},
			{
				name: 'Add Tag',
				value: 'addTag',
				description: 'Add a tag to a subscription',
				action: 'Add a tag to a subscription',
				routing: {
					request: {
						method: 'POST',
						url: '=/publications/{{$parameter["publicationId"]}}/subscriptions/{{$parameter["subscriptionId"]}}/tags',
						body: {
							tag: '={{$parameter["tag"]}}',
						},
					},
				},
			},
			{
				name: 'Bulk Create',
				value: 'bulkCreate',
				description: 'Create multiple subscriptions in bulk',
				action: 'Bulk create subscriptions',
				routing: {
					request: {
						method: 'POST',
						url: '=/publications/{{$parameter["publicationId"]}}/subscriptions/bulk',
						body: {
							subscriptions: '={{$parameter["subscriptions"]}}',
						},
					},
				},
			},
			{
				name: 'Bulk Update',
				value: 'bulkUpdate',
				description: 'Update multiple subscriptions in bulk',
				action: 'Bulk update subscriptions',
				routing: {
					request: {
						method: 'PUT',
						url: '=/publications/{{$parameter["publicationId"]}}/subscriptions/bulk',
						body: {
							subscriptions: '={{$parameter["bulkUpdateItems"]}}',
						},
					},
				},
			},
			{
				name: 'Bulk Update Status',
				value: 'bulkUpdateStatus',
				description: 'Update the status of multiple subscriptions',
				action: 'Bulk update subscription status',
				routing: {
					request: {
						method: 'PUT',
						url: '=/publications/{{$parameter["publicationId"]}}/subscriptions/bulk/status',
						body: {
							subscription_ids: '={{$parameter["subscriptionIds"]}}',
							status: '={{$parameter["bulkStatus"]}}',
						},
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
		displayName: 'Unsubscribe',
		name: 'unsubscribe',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['subscription'],
				operation: ['update', 'updateByEmail'],
			},
		},
		default: false,
		description: 'Whether to unsubscribe the user',
	},
	{
		displayName: 'Reactivate Existing',
		name: 'reactivateExisting',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['subscription'],
				operation: ['create'],
			},
		},
		default: false,
		description: 'Whether to reactivate an existing subscription',
	},
	{
		displayName: 'Send Welcome Email',
		name: 'sendWelcomeEmail',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['subscription'],
				operation: ['create'],
			},
		},
		default: false,
		description: 'Whether to send a welcome email',
	},
	{
		displayName: 'UTM Source',
		name: 'utmSource',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['subscription'],
				operation: ['create'],
			},
		},
		default: '',
	},
	{
		displayName: 'UTM Medium',
		name: 'utmMedium',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['subscription'],
				operation: ['create'],
			},
		},
		default: '',
	},
	{
		displayName: 'UTM Campaign',
		name: 'utmCampaign',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['subscription'],
				operation: ['create'],
			},
		},
		default: '',
	},
	{
		displayName: 'Referring Site',
		name: 'referringSite',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['subscription'],
				operation: ['create'],
			},
		},
		default: '',
	},
	{
		displayName: 'Referral Code',
		name: 'referralCode',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['subscription'],
				operation: ['create'],
			},
		},
		default: '',
	},
	{
		displayName: 'Update Email',
		name: 'updateEmail',
		type: 'string',
		placeholder: 'name@email.com',
		displayOptions: {
			show: { resource: ['subscription'], operation: ['update', 'updateByEmail'] },
		},
		default: '',
		description: 'New email address for the subscriber',
	},
	{
		displayName: 'Stripe Customer ID',
		name: 'stripeCustomerId',
		type: 'string',
		displayOptions: {
			show: { resource: ['subscription'], operation: ['update', 'updateByEmail'] },
		},
		default: '',
		description: 'Stripe customer ID to associate with this subscription',
	},
	{
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
		description: 'Custom fields to set on the subscription',
	},
	{
		displayName: 'Tags',
		name: 'tags',
		type: 'string',
		displayOptions: {
			show: { resource: ['subscription'], operation: ['create'] },
		},
		default: '',
		description: 'Comma-separated list of tags to apply to the subscription',
		placeholder: 'tag1,tag2',
	},
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
		displayName: 'Tag',
		name: 'tag',
		type: 'string',
		required: true,
		displayOptions: {
			show: { resource: ['subscription'], operation: ['addTag'] },
		},
		default: '',
		description: 'The tag to add to the subscription',
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
		description: 'Array of subscription update objects. Each must have a "subscription_id". Example: [{"subscription_id":"sub_123","email":"new@example.com"}]',
	},
	{
		displayName: 'Subscription IDs',
		name: 'subscriptionIds',
		type: 'json',
		required: true,
		displayOptions: {
			show: { resource: ['subscription'], operation: ['bulkUpdateStatus'] },
		},
		default: '[]',
		description: 'Array of subscription IDs to update. Example: ["sub_abc123","sub_def456"]',
	},
	{
		displayName: 'Status',
		name: 'bulkStatus',
		type: 'options',
		options: [
			{ name: 'Active', value: 'active' },
			{ name: 'Inactive', value: 'inactive' },
		],
		required: true,
		displayOptions: {
			show: { resource: ['subscription'], operation: ['bulkUpdateStatus'] },
		},
		default: 'active',
		description: 'The status to set for the selected subscriptions',
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
];
