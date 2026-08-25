import { INodeProperties } from 'n8n-workflow';
import {
	beehiivListPagination,
	mergeAdditionalFields,
	paginationFields,
	unwrapDataProperty,
} from '../../shared/GenericFunctions';

const eventTypeOptions = [
	{ name: 'Newsletter List Subscription: Paused', value: 'newsletter_list_subscription.paused' },
	{ name: 'Newsletter List Subscription: Resumed', value: 'newsletter_list_subscription.resumed' },
	{ name: 'Newsletter List Subscription: Subscribed', value: 'newsletter_list_subscription.subscribed' },
	{ name: 'Newsletter List Subscription: Unsubscribed', value: 'newsletter_list_subscription.unsubscribed' },
	{ name: 'Podcast Episode: Archived', value: 'podcasts.episode.archived' },
	{ name: 'Podcast Episode: Deleted', value: 'podcasts.episode.deleted' },
	{ name: 'Podcast Episode: Published', value: 'podcasts.episode.published' },
	{ name: 'Podcast Episode: Updated', value: 'podcasts.episode.updated' },
	{ name: 'Podcast Private Feed: Access Revoked', value: 'podcasts.private_feed.access_revoked' },
	{ name: 'Podcast Private Feed: Activated', value: 'podcasts.private_feed.activated' },
	{ name: 'Podcast Private Feed: Deactivated', value: 'podcasts.private_feed.deactivated' },
	{ name: 'Post: Scheduled', value: 'post.scheduled' },
	{ name: 'Post: Sent', value: 'post.sent' },
	{ name: 'Post: Updated', value: 'post.updated' },
	{ name: 'Survey: Response Submitted', value: 'survey.response_submitted' },
	{ name: 'Subscription: Confirmed', value: 'subscription.confirmed' },
	{ name: 'Subscription: Created', value: 'subscription.created' },
	{ name: 'Subscription: Deleted', value: 'subscription.deleted' },
	{ name: 'Subscription: Downgraded', value: 'subscription.downgraded' },
	{ name: 'Subscription: Paused', value: 'subscription.paused' },
	{ name: 'Subscription: Resumed', value: 'subscription.resumed' },
	{ name: 'Subscription: Upgraded', value: 'subscription.upgraded' },
	{ name: 'Subscription Tier: Created', value: 'subscription.tier.created' },
	{ name: 'Subscription Tier: Deleted', value: 'subscription.tier.deleted' },
	{ name: 'Subscription Tier: Paused', value: 'subscription.tier.paused' },
	{ name: 'Subscription Tier: Resumed', value: 'subscription.tier.resumed' },
];

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
							event_types: '={{$parameter["event_types"]}}',
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
					output: {
						postReceive: [unwrapDataProperty],
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Retrieve many webhooks',
				action: 'Get many webhooks',
				routing: {
					request: {
						method: 'GET',
						url: '=/publications/{{$parameter["publicationId"]}}/webhooks',
					},
					operations: {
						pagination: beehiivListPagination,
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a webhook',
				action: 'Update a webhook',
				routing: {
					// Beehiiv's webhook update endpoint does not accept "url" — only event_types
					// and description can be changed after creation.
					request: {
						method: 'PATCH',
						url: '=/publications/{{$parameter["publicationId"]}}/webhooks/{{$parameter["webhookId"]}}',
					},
					send: {
						preSend: [mergeAdditionalFields('updateFields')],
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
				operation: ['create'],
			},
		},
		default: '',
		description: 'The URL events will be sent to. Cannot be changed after creation.',
	},
	{
		displayName: 'Event Types',
		name: 'event_types',
		type: 'multiOptions',
		options: eventTypeOptions,
		required: true,
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['create'],
			},
		},
		default: [],
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: ['webhook'], operation: ['create'] },
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'A description of the webhook',
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
			show: { resource: ['webhook'], operation: ['update'] },
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'A description of the webhook',
			},
			{
				displayName: 'Event Types',
				name: 'event_types',
				type: 'multiOptions',
				options: eventTypeOptions,
				default: [],
			},
		],
	},
	...paginationFields('webhook', ['getAll']),
];
