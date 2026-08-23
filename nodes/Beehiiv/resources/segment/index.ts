import { INodeProperties } from 'n8n-workflow';
import {
	beehiivListPagination,
	mergeAdditionalFields,
	paginationFields,
	unwrapDataProperty,
} from '../../shared/GenericFunctions';

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
				name: 'Create',
				value: 'create',
				description: 'Create a new segment',
				action: 'Create a segment',
				routing: {
					request: {
						method: 'POST',
						url: '=/publications/{{$parameter["publicationId"]}}/segments',
						body: {
							name: '={{$parameter["name"]}}',
							where: '={{$parameter["where"]}}',
						},
					},
					send: {
						preSend: [mergeAdditionalFields('additionalFields')],
					},
					output: {
						postReceive: [unwrapDataProperty],
					},
				},
			},
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
					output: {
						postReceive: [unwrapDataProperty],
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
					operations: {
						pagination: beehiivListPagination,
					},
				},
			},
			{
				name: 'Recalculate',
				value: 'recalculate',
				description: 'Trigger recalculation of a segment',
				action: 'Recalculate a segment',
				routing: {
					// Beehiiv's recalculate endpoint is PUT, not POST.
					request: {
						method: 'PUT',
						url: '=/publications/{{$parameter["publicationId"]}}/segments/{{$parameter["segmentId"]}}/recalculate',
					},
				},
			},
			{
				name: 'List Subscribers',
				value: 'listSubscribers',
				description: 'List subscriptions in a segment',
				action: 'List segment subscribers',
				routing: {
					// Documented as .../members, not .../subscribers.
					request: {
						method: 'GET',
						url: '=/publications/{{$parameter["publicationId"]}}/segments/{{$parameter["segmentId"]}}/members',
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
				operation: ['get', 'delete', 'recalculate', 'listSubscribers'],
			},
		},
		default: '',
		description: 'The ID of the segment',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		displayOptions: {
			show: { resource: ['segment'], operation: ['create'] },
		},
		default: '',
	},
	{
		displayName: 'Where',
		name: 'where',
		type: 'string',
		required: true,
		typeOptions: { rows: 3 },
		displayOptions: {
			show: { resource: ['segment'], operation: ['create'] },
		},
		default: '',
		description:
			'SQL-like WHERE clause defining segment membership. Examples: "status = \'active\'", "unique_opens >= 3 AND status = \'active\'".',
		placeholder: "status = 'active'",
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: ['segment'], operation: ['create'] },
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Segment Type',
				name: 'segment_type',
				type: 'options',
				options: [
					{ name: 'Dynamic (Auto-Recalculates)', value: 'dynamic' },
					{ name: 'Static (Calculated Once)', value: 'static' },
				],
				default: 'dynamic',
			},
		],
	},
	...paginationFields('segment', ['getAll', 'listSubscribers']),
];
