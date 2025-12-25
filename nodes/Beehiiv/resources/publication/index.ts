import { INodeProperties } from 'n8n-workflow';

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
];
