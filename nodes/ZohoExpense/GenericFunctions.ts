import type {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	ILoadOptionsFunctions,
	IRequestOptions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

export async function zohoExpenseApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
	uri?: string,
): Promise<IDataObject> {
	const credentials = await this.getCredentials('zohoExpenseOAuth2Api');
	const dataCenter = credentials.dataCenter as string;

	const baseUrl = dataCenter === 'ca'
		? 'https://www.zohoapis.ca'
		: `https://www.zohoapis.${dataCenter}`;

	// Get organization ID - node parameter takes priority over credential
	let organizationId: string | undefined;

	// First try to get from node parameters (allows override)
	try {
		if ('getCurrentNodeParameter' in this) {
			organizationId = (this as ILoadOptionsFunctions).getCurrentNodeParameter('organizationId') as string;
		} else {
			organizationId = (this as IExecuteFunctions).getNodeParameter('organizationId', 0, '') as string;
		}
	} catch {
		// Node parameter not available
	}

	// Fall back to credential if node parameter is empty
	if (!organizationId && credentials.organizationId) {
		organizationId = credentials.organizationId as string;
	}

	const headers: IDataObject = {};
	if (organizationId) {
		headers['X-com-zoho-expense-organizationid'] = organizationId;
	}

	const options: IRequestOptions = {
		method,
		body,
		qs,
		uri: uri || `${baseUrl}/expense/v1${endpoint}`,
		json: true,
		headers: Object.keys(headers).length > 0 ? headers : undefined,
	};

	if (Object.keys(body).length === 0) {
		delete options.body;
	}

	if (Object.keys(qs).length === 0) {
		delete options.qs;
	}

	try {
		const response = await this.helpers.requestOAuth2.call(
			this,
			'zohoExpenseOAuth2Api',
			options,
		);

		if (response.code !== 0) {
			throw new NodeApiError(this.getNode(), response as JsonObject, {
				message: response.message as string,
			});
		}

		return response as IDataObject;
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

export async function zohoExpenseApiRequestAllItems(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
	propertyName: string,
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];

	let responseData;
	qs.page = 1;
	qs.per_page = 200;

	do {
		responseData = await zohoExpenseApiRequest.call(this, method, endpoint, body, qs);
		const items = responseData[propertyName] as IDataObject[];

		if (items) {
			returnData.push(...items);
		}

		qs.page++;
	} while (
		responseData.page_context &&
		(responseData.page_context as IDataObject).has_more_page === true
	);

	return returnData;
}

export function simplify(data: IDataObject[], fields: string[]): IDataObject[] {
	return data.map((item) => {
		const simplified: IDataObject = {};
		for (const field of fields) {
			if (item[field] !== undefined) {
				simplified[field] = item[field];
			}
		}
		return simplified;
	});
}
