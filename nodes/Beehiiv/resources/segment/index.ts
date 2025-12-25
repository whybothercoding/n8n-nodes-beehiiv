import { INodeProperties } from 'n8n-workflow';

export const segmentDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['segment'],
			},
		},
		options: [
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a segment',
				action: 'Delete a segment',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/publications/{{$parameter["publicationId"]}}/segments/{{$parameter["segmentId"]}}',
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a segment',
				action: 'Get a segment',
				routing: {
					request: {
						method: 'GET',
						url: '=/publications/{{$parameter["publicationId"]}}/segments/{{$parameter["segmentId"]}}',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Retrieve many segments',
				action: 'Get many segments',
				routing: {
					request: {
						method: 'GET',
						url: '=/publications/{{$parameter["publicationId"]}}/segments',
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
				resource: ['segment'],
			},
		},
		default: '',
		description: 'The ID of the publication',
	},
	{
		displayName: 'Segment ID',
		name: 'segmentId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['segment'],
				operation: ['get', 'delete'],
			},
		},
		default: '',
		description: 'The ID of the segment',
	},
];
