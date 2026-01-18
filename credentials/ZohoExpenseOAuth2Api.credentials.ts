import type {
	IAuthenticateGeneric,
	ICredentialDataDecryptedObject,
	ICredentialTestRequest,
	ICredentialType,
	IHttpRequestHelper,
	INodeProperties,
} from 'n8n-workflow';

export class ZohoExpenseOAuth2Api implements ICredentialType {
	name = 'zohoExpenseOAuth2Api';

	extends = ['oAuth2Api'];

	displayName = 'Zoho Expense OAuth2 API';

	documentationUrl = 'https://www.zoho.com/expense/api/v1/';

	properties: INodeProperties[] = [
		{
			displayName: 'Grant Type',
			name: 'grantType',
			type: 'hidden',
			default: 'authorizationCode',
		},
		{
			displayName: 'Data Center',
			name: 'dataCenter',
			type: 'options',
			options: [
				{
					name: 'zoho.com (US)',
					value: 'com',
				},
				{
					name: 'zoho.eu (Europe)',
					value: 'eu',
				},
				{
					name: 'zoho.in (India)',
					value: 'in',
				},
				{
					name: 'zoho.com.au (Australia)',
					value: 'com.au',
				},
				{
					name: 'zoho.jp (Japan)',
					value: 'jp',
				},
				{
					name: 'zoho.com.cn (China)',
					value: 'com.cn',
				},
				{
					name: 'zohocloud.ca (Canada)',
					value: 'ca',
				},
			],
			default: 'com',
			description: 'The Zoho data center to connect to',
		},
		{
			displayName: 'Authorization URL',
			name: 'authUrl',
			type: 'hidden',
			default: '={{$self["dataCenter"] === "ca" ? "https://accounts.zohocloud.ca/oauth/v2/auth" : "https://accounts.zoho." + $self["dataCenter"] + "/oauth/v2/auth"}}',
		},
		{
			displayName: 'Access Token URL',
			name: 'accessTokenUrl',
			type: 'hidden',
			default: '={{$self["dataCenter"] === "ca" ? "https://accounts.zohocloud.ca/oauth/v2/token" : "https://accounts.zoho." + $self["dataCenter"] + "/oauth/v2/token"}}',
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'hidden',
			default: 'ZohoExpense.fullaccess.all',
		},
		{
			displayName: 'Auth URI Query Parameters',
			name: 'authQueryParameters',
			type: 'hidden',
			default: 'access_type=offline&prompt=consent',
		},
		{
			displayName: 'Authentication',
			name: 'authentication',
			type: 'hidden',
			default: 'body',
		},
	];

	async preAuthentication(this: IHttpRequestHelper, credentials: ICredentialDataDecryptedObject) {
		return {};
	}

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.oauthTokenData.access_token}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.dataCenter === "ca" ? "https://www.zohoapis.ca" : "https://www.zohoapis." + $credentials.dataCenter}}',
			url: '/expense/v1/organizations',
			method: 'GET',
		},
	};
}
