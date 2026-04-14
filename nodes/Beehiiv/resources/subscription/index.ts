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
				operation: ['get', 'delete', 'update'],
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
				operation: ['update'],
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
			show: { resource: ['subscription'], operation: ['update'] },
		},
		default: '',
		description: 'New email address for the subscriber',
	},
	{
		displayName: 'Stripe Customer ID',
		name: 'stripeCustomerId',
		type: 'string',
		displayOptions: {
			show: { resource: ['subscription'], operation: ['update'] },
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
			show: { resource: ['subscription'], operation: ['update', 'create'] },
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
];
