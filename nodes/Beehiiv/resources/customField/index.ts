import { INodeProperties } from 'n8n-workflow';

export const customFieldDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['customField'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new custom field',
				action: 'Create a custom field',
				routing: {
					request: {
						method: 'POST',
						url: '=/publications/{{$parameter["publicationId"]}}/custom_fields',
						body: {
							name: '={{$parameter["name"]}}',
							type: '={{$parameter["type"]}}',
						},
					},
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a custom field',
				action: 'Delete a custom field',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/publications/{{$parameter["publicationId"]}}/custom_fields/{{$parameter["customFieldId"]}}',
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a custom field',
				action: 'Get a custom field',
				routing: {
					request: {
						method: 'GET',
						url: '=/publications/{{$parameter["publicationId"]}}/custom_fields/{{$parameter["customFieldId"]}}',
					},
				},
			},
			{
				name: 'Get All',
				value: 'getAll',
				description: 'Retrieve all custom fields',
				action: 'Get all custom fields',
				routing: {
					request: {
						method: 'GET',
						url: '=/publications/{{$parameter["publicationId"]}}/custom_fields',
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a custom field',
				action: 'Update a custom field',
				routing: {
					request: {
						method: 'PATCH',
						url: '=/publications/{{$parameter["publicationId"]}}/custom_fields/{{$parameter["customFieldId"]}}',
						body: {
							name: '={{$parameter["name"]}}',
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
				resource: ['customField'],
			},
		},
		default: '',
		description: 'The ID of the publication',
	},
	{
		displayName: 'Custom Field ID',
		name: 'customFieldId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['customField'],
				operation: ['get', 'delete', 'update'],
			},
		},
		default: '',
		description: 'The ID of the custom field',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['customField'],
				operation: ['create', 'update'],
			},
		},
		default: '',
	},
	{
		displayName: 'Type',
		name: 'type',
		type: 'options',
		options: [
			{
				name: 'String',
				value: 'string',
			},
			{
				name: 'Number',
				value: 'number',
			},
			{
				name: 'Date',
				value: 'date',
			},
			{
				name: 'Boolean',
				value: 'boolean',
			},
		],
		displayOptions: {
			show: {
				resource: ['customField'],
				operation: ['create'],
			},
		},
		default: 'string',
	},
];
