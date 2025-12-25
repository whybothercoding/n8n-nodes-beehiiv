import { INodeProperties } from 'n8n-workflow';

export const automationDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['automation'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get an automation',
				action: 'Get an automation',
				routing: {
					request: {
						method: 'GET',
						url: '=/publications/{{$parameter["publicationId"]}}/automations/{{$parameter["automationId"]}}',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Retrieve many automations',
				action: 'Get many automations',
				routing: {
					request: {
						method: 'GET',
						url: '=/publications/{{$parameter["publicationId"]}}/automations',
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
				resource: ['automation'],
			},
		},
		default: '',
		description: 'The ID of the publication',
	},
	{
		displayName: 'Automation ID',
		name: 'automationId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['automation'],
				operation: ['get'],
			},
		},
		default: '',
		description: 'The ID of the automation',
	},
];
