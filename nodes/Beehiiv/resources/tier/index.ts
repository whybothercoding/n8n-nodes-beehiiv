import { INodeProperties } from 'n8n-workflow';

export const tierDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['tier'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new tier',
				action: 'Create a tier',
				routing: {
					request: {
						method: 'POST',
						url: '=/publications/{{$parameter["publicationId"]}}/tiers',
						body: {
							name: '={{$parameter["name"]}}',
							description: '={{$parameter["description"]}}',
						},
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a tier',
				action: 'Get a tier',
				routing: {
					request: {
						method: 'GET',
						url: '=/publications/{{$parameter["publicationId"]}}/tiers/{{$parameter["tierId"]}}',
					},
				},
			},
			{
				name: 'Get All',
				value: 'getAll',
				description: 'Retrieve all tiers',
				action: 'Get all tiers',
				routing: {
					request: {
						method: 'GET',
						url: '=/publications/{{$parameter["publicationId"]}}/tiers',
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a tier',
				action: 'Update a tier',
				routing: {
					request: {
						method: 'PATCH',
						url: '=/publications/{{$parameter["publicationId"]}}/tiers/{{$parameter["tierId"]}}',
						body: {
							name: '={{$parameter["name"]}}',
							description: '={{$parameter["description"]}}',
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
				resource: ['tier'],
			},
		},
		default: '',
		description: 'The ID of the publication',
	},
	{
		displayName: 'Tier ID',
		name: 'tierId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['tier'],
				operation: ['get', 'update'],
			},
		},
		default: '',
		description: 'The ID of the tier',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['tier'],
				operation: ['create', 'update'],
			},
		},
		default: '',
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['tier'],
				operation: ['create', 'update'],
			},
		},
		default: '',
	},
];
