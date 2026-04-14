import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { automationDescription } from './resources/automation';
import { customFieldDescription } from './resources/customField';
import { postDescription } from './resources/post';
import { publicationDescription } from './resources/publication';
import { referralProgramDescription } from './resources/referralProgram';
import { segmentDescription } from './resources/segment';
import { subscriptionDescription } from './resources/subscription';
import { tierDescription } from './resources/tier';
import { webhookDescription } from './resources/webhook';

export class Beehiiv implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Beehiiv',
		name: 'beehiiv',
		icon: 'file:../../icons/beehiiv.svg',
		group: ['input'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Consume Beehiiv API',
		defaults: {
			name: 'Beehiiv',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'beehiivApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://api.beehiiv.com/v2',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Automation',
						value: 'automation',
					},
					{
						name: 'Custom Field',
						value: 'customField',
					},
					{
						name: 'Post',
						value: 'post',
					},
					{
						name: 'Publication',
						value: 'publication',
					},
					{
						name: 'Referral Program',
						value: 'referralProgram',
					},
					{
						name: 'Segment',
						value: 'segment',
					},
					{
						name: 'Subscription',
						value: 'subscription',
					},
					{
						name: 'Tier',
						value: 'tier',
					},
					{
						name: 'Webhook',
						value: 'webhook',
					},
				],
				default: 'publication',
			},
			...publicationDescription,
			...referralProgramDescription,
			...subscriptionDescription,
			...postDescription,
			...customFieldDescription,
			...segmentDescription,
			...automationDescription,
			...tierDescription,
			...webhookDescription,
		],
		usableAsTool: true,
	};
}
