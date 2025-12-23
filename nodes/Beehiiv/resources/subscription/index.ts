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
				name: 'Get All',
				value: 'getAll',
				description: 'Retrieve all subscriptions',
				action: 'Get all subscriptions',
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
						method: 'PATCH',
						url: '=/publications/{{$parameter["publicationId"]}}/subscriptions/{{$parameter["subscriptionId"]}}',
						body: {
							unsubscribe: '={{$parameter["unsubscribe"]}}',
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
		description: 'UTM source',
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
		description: 'UTM medium',
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
		description: 'UTM campaign',
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
		description: 'Referring site',
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
		description: 'Referral code',
	},
];
