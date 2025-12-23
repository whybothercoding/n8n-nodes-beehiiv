import { INodeProperties } from 'n8n-workflow';

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
					request: {
						method: 'POST',
						url: '=/publications/{{$parameter["publicationId"]}}/posts',
						body: {
							title: '={{$parameter["title"]}}',
							subtitle: '={{$parameter["subtitle"]}}',
							content_html: '={{$parameter["contentHtml"]}}',
							content_json: '={{$parameter["contentJson"]}}',
							slug: '={{$parameter["slug"]}}',
							preview_text: '={{$parameter["previewText"]}}',
							thumbnail_url: '={{$parameter["thumbnailUrl"]}}',
							audience: '={{$parameter["audience"]}}',
							send_to_email: '={{$parameter["sendToEmail"]}}',
							send_to_web: '={{$parameter["sendToWeb"]}}',
							draft: '={{$parameter["draft"]}}',
							schedule_at: '={{$parameter["scheduleAt"]}}',
						},
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
				},
			},
			{
				name: 'Get All',
				value: 'getAll',
				description: 'Retrieve all posts',
				action: 'Get all posts',
				routing: {
					request: {
						method: 'GET',
						url: '=/publications/{{$parameter["publicationId"]}}/posts',
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
		displayName: 'Subtitle',
		name: 'subtitle',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
			},
		},
		default: '',
	},
	{
		displayName: 'Content HTML',
		name: 'contentHtml',
		type: 'string',
		typeOptions: {
			rows: 5,
		},
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
			},
		},
		default: '',
	},
	{
		displayName: 'Content JSON',
		name: 'contentJson',
		type: 'json',
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
			},
		},
		default: '',
	},
	{
		displayName: 'Slug',
		name: 'slug',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
			},
		},
		default: '',
	},
	{
		displayName: 'Preview Text',
		name: 'previewText',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
			},
		},
		default: '',
	},
	{
		displayName: 'Thumbnail URL',
		name: 'thumbnailUrl',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
			},
		},
		default: '',
	},
	{
		displayName: 'Audience',
		name: 'audience',
		type: 'options',
		options: [
			{
				name: 'All',
				value: 'all',
			},
			{
				name: 'Premium',
				value: 'premium',
			},
			{
				name: 'Free',
				value: 'free',
			},
		],
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
			},
		},
		default: 'all',
	},
	{
		displayName: 'Send to Email',
		name: 'sendToEmail',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
			},
		},
		default: false,
	},
	{
		displayName: 'Send to Web',
		name: 'sendToWeb',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
			},
		},
		default: false,
	},
	{
		displayName: 'Draft',
		name: 'draft',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
			},
		},
		default: false,
	},
	{
		displayName: 'Schedule At',
		name: 'scheduleAt',
		type: 'dateTime',
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
			},
		},
		default: '',
	},
];
