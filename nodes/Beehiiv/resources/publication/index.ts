import { INodeProperties } from 'n8n-workflow';
import { beehiivListPagination, paginationFields, unwrapDataProperty } from '../../shared/GenericFunctions';

export const publicationDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['publication'],
			},
		},
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Retrieve many publications',
				action: 'Get many publications',
				routing: {
					request: {
						method: 'GET',
						url: '/publications',
					},
					operations: {
						pagination: beehiivListPagination,
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a publication',
				action: 'Get a publication',
				routing: {
					request: {
						method: 'GET',
						url: '=/publications/{{$parameter["publicationId"]}}',
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
				resource: ['publication'],
				operation: ['get'],
			},
		},
		default: '',
		description: 'The ID of the publication',
	},
	...paginationFields('publication', ['getAll']),
];
