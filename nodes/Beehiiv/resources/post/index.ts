import { INodeProperties } from 'n8n-workflow';
import {
	beehiivListPagination,
	mergeAdditionalFields,
	paginationFields,
	parseBodyJsonStrings,
	unwrapDataProperty,
} from '../../shared/GenericFunctions';

export const postDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['post'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new post',
				action: 'Create a post',
				routing: {
					// Beehiiv's create-post body only accepts "title" plus either "body_content"
					// (raw HTML) or "blocks" (structured content array) — not the subtitle/slug/
					// audience/scheduling fields this operation used to send.
					request: {
						method: 'POST',
						url: '=/publications/{{$parameter["publicationId"]}}/posts',
						body: {
							title: '={{$parameter["title"]}}',
						},
					},
					send: {
						preSend: [mergeAdditionalFields('additionalFields'), parseBodyJsonStrings('blocks')],
					},
					output: {
						postReceive: [unwrapDataProperty],
					},
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a post',
				action: 'Delete a post',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/publications/{{$parameter["publicationId"]}}/posts/{{$parameter["postId"]}}',
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a post',
				action: 'Get a post',
				routing: {
					request: {
						method: 'GET',
						url: '=/publications/{{$parameter["publicationId"]}}/posts/{{$parameter["postId"]}}',
					},
					output: {
						postReceive: [unwrapDataProperty],
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Retrieve many posts',
				action: 'Get many posts',
				routing: {
					request: {
						method: 'GET',
						url: '=/publications/{{$parameter["publicationId"]}}/posts',
					},
					operations: {
						pagination: beehiivListPagination,
					},
				},
			},
			{
				name: 'Get Aggregate Stats',
				value: 'getAggregateStats',
				description: 'Get aggregate statistics for posts',
				action: 'Get post aggregate stats',
				routing: {
					request: {
						method: 'GET',
						url: '=/publications/{{$parameter["publicationId"]}}/posts/aggregate_stats',
					},
					output: {
						postReceive: [unwrapDataProperty],
					},
				},
			},
			{
				name: 'List Templates',
				value: 'listTemplates',
				description: 'Retrieve post templates for a publication',
				action: 'List post templates',
				routing: {
					request: {
						method: 'GET',
						url: '=/publications/{{$parameter["publicationId"]}}/post_templates',
					},
					operations: {
						pagination: beehiivListPagination,
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
				resource: ['post'],
			},
		},
		default: '',
		description: 'The ID of the publication',
	},
	{
		displayName: 'Post ID',
		name: 'postId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['get', 'delete'],
			},
		},
		default: '',
		description: 'The ID of the post',
	},
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['post'],
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
			show: { resource: ['post'], operation: ['create'] },
		},
		options: [
			{
				displayName: 'Blocks (JSON)',
				name: 'blocks',
				type: 'json',
				default: '',
				description: 'Advanced: structured content blocks array, as documented by the Beehiiv API. Alternative to Body Content (HTML) below.',
			},
			{
				displayName: 'Body Content (HTML)',
				name: 'body_content',
				type: 'string',
				typeOptions: { rows: 5 },
				default: '',
				description: 'Raw HTML content for the post. Alternative to Blocks (JSON) above — Beehiiv accepts one or the other.',
			},
		],
	},
	...paginationFields('post', ['getAll', 'listTemplates']),
];
