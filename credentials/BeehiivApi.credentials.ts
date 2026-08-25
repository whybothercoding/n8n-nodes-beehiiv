import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
	Icon,
} from 'n8n-workflow';

export class BeehiivApi implements ICredentialType {
	name = 'beehiivApi';
	displayName = 'Beehiiv API';
	documentationUrl = 'https://developers.beehiiv.com/api-reference';
	icon: Icon = 'file:../icons/beehiiv.svg';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.beehiiv.com/v2',
			url: '/publications',
			method: 'GET',
		},
	};
}
