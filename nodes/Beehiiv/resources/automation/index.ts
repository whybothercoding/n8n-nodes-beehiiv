import { INodeProperties } from 'n8n-workflow';
import { beehiivListPagination, paginationFields, unwrapDataProperty } from '../../shared/GenericFunctions';

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
					output: {
						postReceive: [unwrapDataProperty],
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
					operations: {
						pagination: beehiivListPagination,
					},
				},
			},
			{
				name: 'List Journeys',
				value: 'listJourneys',
				description: 'List journeys for an automation',
				action: 'List automation journeys',
				routing: {
					request: {
						method: 'GET',
						url: '=/publications/{{$parameter["publicationId"]}}/automations/{{$parameter["automationId"]}}/journeys',
					},
					operations: {
						pagination: beehiivListPagination,
					},
				},
			},
			{
				name: 'Get Journey',
				value: 'getJourney',
				description: 'Get a specific journey within an automation',
				action: 'Get an automation journey',
				routing: {
					request: {
						method: 'GET',
						url: '=/publications/{{$parameter["publicationId"]}}/automations/{{$parameter["automationId"]}}/journeys/{{$parameter["journeyId"]}}',
					},
					output: {
						postReceive: [unwrapDataProperty],
					},
				},
			},
			{
				name: 'Add Subscription',
				value: 'addSubscription',
				description: 'Add a subscription to an automation',
				action: 'Add subscription to automation',
				routing: {
					request: {
						method: 'POST',
						url: '=/publications/{{$parameter["publicationId"]}}/automations/{{$parameter["automationId"]}}/journeys',
						body: {
							subscription_id: '={{$parameter["subscriptionId"]}}',
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
				operation: ['get', 'listJourneys', 'getJourney', 'addSubscription'],
			},
		},
		default: '',
		description: 'The ID of the automation',
	},
	{
		displayName: 'Journey ID',
		name: 'journeyId',
		type: 'string',
		required: true,
		displayOptions: {
			show: { resource: ['automation'], operation: ['getJourney'] },
		},
		default: '',
		description: 'The ID of the automation journey',
	},
	{
		displayName: 'Subscription ID',
		name: 'subscriptionId',
		type: 'string',
		required: true,
		displayOptions: {
			show: { resource: ['automation'], operation: ['addSubscription'] },
		},
		default: '',
		description: 'The ID of the subscription to add to this automation',
	},
	...paginationFields('automation', ['getAll', 'listJourneys']),
];
