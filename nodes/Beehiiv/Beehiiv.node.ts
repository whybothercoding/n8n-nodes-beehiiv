import { customFieldDescription } from './resources/customField';
import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { subscriptionDescription } from './resources/subscription';
import { postDescription } from './resources/post';
import { publicationDescription } from './resources/publication';
import { segmentDescription } from './resources/segment';
import { automationDescription } from './resources/automation';
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
						name: 'Publication',
						value: 'publication',
					},
					{
						name: 'Subscription',
						value: 'subscription',
					},
					{
						name: 'Post',
						value: 'post',
					},
					{
						name: 'Custom Field',
						value: 'customField',
					},
					{
						name: 'Segment',
						value: 'segment',
					},
					{
						name: 'Automation',
						value: 'automation',
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
			...subscriptionDescription,
			...postDescription,
			...customFieldDescription,
			...segmentDescription,
			...automationDescription,
			...tierDescription,
			...webhookDescription,
		],
	};
}
