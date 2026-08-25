import { INodeProperties } from 'n8n-workflow';
import { beehiivListPagination, paginationFields, unwrapDataProperty } from '../../shared/GenericFunctions';

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
							display: '={{$parameter["display"]}}',
							kind: '={{$parameter["kind"]}}',
						},
					},
					output: {
						postReceive: [unwrapDataProperty],
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
					output: {
						postReceive: [unwrapDataProperty],
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Retrieve many custom fields',
				action: 'Get many custom fields',
				routing: {
					request: {
						method: 'GET',
						url: '=/publications/{{$parameter["publicationId"]}}/custom_fields',
					},
					operations: {
						pagination: beehiivListPagination,
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a custom field',
				action: 'Update a custom field',
				routing: {
					// Beehiiv's update-custom-field endpoint is PUT, not PATCH, and only accepts "display".
					request: {
						method: 'PUT',
						url: '=/publications/{{$parameter["publicationId"]}}/custom_fields/{{$parameter["customFieldId"]}}',
						body: {
							display: '={{$parameter["display"]}}',
						},
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
		displayName: 'Display Name',
		name: 'display',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['customField'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'The label shown for this custom field',
	},
	{
		displayName: 'Display Name',
		name: 'display',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['customField'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'The new label to show for this custom field',
	},
	{
		displayName: 'Kind',
		name: 'kind',
		type: 'options',
		options: [
			{ name: 'Boolean', value: 'boolean' },
			{ name: 'Date', value: 'date' },
			{ name: 'Datetime', value: 'datetime' },
			{ name: 'Double', value: 'double' },
			{ name: 'Integer', value: 'integer' },
			{ name: 'List', value: 'list' },
			{ name: 'String', value: 'string' },
		],
		required: true,
		displayOptions: {
			show: {
				resource: ['customField'],
				operation: ['create'],
			},
		},
		default: 'string',
		description: 'The type of value stored in this custom field',
	},
	...paginationFields('customField', ['getAll']),
];
