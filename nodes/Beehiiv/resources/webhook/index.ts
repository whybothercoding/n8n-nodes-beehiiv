import { INodeProperties } from 'n8n-workflow';

export const webhookDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['webhook'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new webhook',
				action: 'Create a webhook',
				routing: {
					request: {
						method: 'POST',
						url: '=/publications/{{$parameter["publicationId"]}}/webhooks',
						body: {
							url: '={{$parameter["url"]}}',
							event_types: '={{$parameter["eventTypes"]}}',
						},
					},
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a webhook',
				action: 'Delete a webhook',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/publications/{{$parameter["publicationId"]}}/webhooks/{{$parameter["webhookId"]}}',
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a webhook',
				action: 'Get a webhook',
				routing: {
					request: {
						method: 'GET',
						url: '=/publications/{{$parameter["publicationId"]}}/webhooks/{{$parameter["webhookId"]}}',
					},
				},
			},
			{
				name: 'Get All',
				value: 'getAll',
				description: 'Retrieve all webhooks',
				action: 'Get all webhooks',
				routing: {
					request: {
						method: 'GET',
						url: '=/publications/{{$parameter["publicationId"]}}/webhooks',
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a webhook',
				action: 'Update a webhook',
				routing: {
					request: {
						method: 'PATCH',
						url: '=/publications/{{$parameter["publicationId"]}}/webhooks/{{$parameter["webhookId"]}}',
						body: {
							url: '={{$parameter["url"]}}',
							event_types: '={{$parameter["eventTypes"]}}',
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
				resource: ['webhook'],
			},
		},
		default: '',
		description: 'The ID of the publication',
	},
	{
		displayName: 'Webhook ID',
		name: 'webhookId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['get', 'delete', 'update'],
			},
		},
		default: '',
		description: 'The ID of the webhook',
	},
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['create', 'update'],
			},
		},
		default: '',
	},
	{
		displayName: 'Event Types',
		name: 'eventTypes',
		type: 'multiOptions',
		options: [
			{
				name: 'Subscription Created',
				value: 'subscription.created',
			},
			{
				name: 'Subscription Activated',
				value: 'subscription.activated',
			},
			{
				name: 'Subscription Scubbed',
				value: 'subscription.scrubbed',
			},
			{
				name: 'Subscription Deleted',
				value: 'subscription.deleted',
			},
			{
				name: 'Subscription Unsubscribed',
				value: 'subscription.unsubscribed',
			},
			{
				name: 'Email Sent',
				value: 'email.sent',
			},
			{
				name: 'Email Delivered',
				value: 'email.delivered',
			},
			{
				name: 'Email Opened',
				value: 'email.opened',
			},
			{
				name: 'Email Clicked',
				value: 'email.clicked',
			},
			{
				name: 'Email Bounced',
				value: 'email.bounced',
			},
			{
				name: 'Email Marked as Spam',
				value: 'email.marked_as_spam',
			},
			{
				name: 'Post Published',
				value: 'post.published',
			},
			{
				name: 'Post Sent',
				value: 'post.sent',
			},
		],
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['create', 'update'],
			},
		},
		default: [],
	},
];
