import { INodeProperties } from 'n8n-workflow';

export const referralProgramDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['referralProgram'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get referral program details for a publication',
				action: 'Get referral program',
				routing: {
					request: {
						method: 'GET',
						url: '=/publications/{{$parameter["publicationId"]}}/referral_program',
					},
				},
			},
		],
		default: 'get',
	},
	{
		displayName: 'Publication ID',
		name: 'publicationId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['referralProgram'],
			},
		},
		default: '',
		description: 'The ID of the publication',
	},
];
