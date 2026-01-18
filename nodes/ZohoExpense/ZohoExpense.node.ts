import type {
	IDataObject,
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import { zohoExpenseApiRequest, zohoExpenseApiRequestAllItems } from './GenericFunctions';

export class ZohoExpense implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Zoho Expense',
		name: 'zohoExpense',
		icon: 'file:zohoExpense.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Consume Zoho Expense API',
		defaults: {
			name: 'Zoho Expense',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'zohoExpenseOAuth2Api',
				required: true,
			},
		],
		properties: [
			// Organization ID
			{
				displayName: 'Organization Name or ID',
				name: 'organizationId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getOrganizations',
				},
				default: '',
				required: false,
				description: 'The organization to operate on. Leave empty to use the default from credentials. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
				hint: 'Overrides the Organization ID set in credentials',
			},
			// Resource
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Category',
						value: 'category',
					},
					{
						name: 'Expense',
						value: 'expense',
					},
					{
						name: 'Expense Report',
						value: 'expenseReport',
					},
					{
						name: 'Trip',
						value: 'trip',
					},
					{
						name: 'User',
						value: 'user',
					},
				],
				default: 'expense',
			},
			// Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['expense'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new expense',
						action: 'Create an expense',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete an expense',
						action: 'Delete an expense',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a single expense',
						action: 'Get an expense',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many expenses',
						action: 'Get many expenses',
					},
					{
						name: 'Merge',
						value: 'merge',
						description: 'Merge multiple expenses',
						action: 'Merge expenses',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update an expense',
						action: 'Update an expense',
					},
				],
				default: 'create',
			},
			// Expense Report Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['expenseReport'],
					},
				},
				options: [
					{
						name: 'Approve',
						value: 'approve',
						description: 'Approve an expense report',
						action: 'Approve an expense report',
					},
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new expense report',
						action: 'Create an expense report',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete an expense report',
						action: 'Delete an expense report',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a single expense report',
						action: 'Get an expense report',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many expense reports',
						action: 'Get many expense reports',
					},
					{
						name: 'Recall',
						value: 'recall',
						description: 'Recall a submitted expense report',
						action: 'Recall an expense report',
					},
					{
						name: 'Reject',
						value: 'reject',
						description: 'Reject an expense report',
						action: 'Reject an expense report',
					},
					{
						name: 'Submit',
						value: 'submit',
						description: 'Submit an expense report for approval',
						action: 'Submit an expense report',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update an expense report',
						action: 'Update an expense report',
					},
				],
				default: 'getAll',
			},
			// Trip Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['trip'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new trip',
						action: 'Create a trip',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a trip',
						action: 'Delete a trip',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a single trip',
						action: 'Get a trip',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many trips',
						action: 'Get many trips',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a trip',
						action: 'Update a trip',
					},
				],
				default: 'getAll',
			},
			// User Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['user'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a single user',
						action: 'Get a user',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many users',
						action: 'Get many users',
					},
				],
				default: 'getAll',
			},
			// Category Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['category'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a single expense category',
						action: 'Get a category',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many expense categories',
						action: 'Get many categories',
					},
				],
				default: 'getAll',
			},

			// ----------------------------------
			//         expense:get
			// ----------------------------------
			{
				displayName: 'Expense ID',
				name: 'expenseId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['expense'],
						operation: ['get'],
					},
				},
				description: 'Unique identifier of the expense to retrieve',
			},

			// ----------------------------------
			//         expense:delete
			// ----------------------------------
			{
				displayName: 'Expense ID',
				name: 'expenseId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['expense'],
						operation: ['delete'],
					},
				},
				description: 'Unique identifier of the expense to delete',
			},

			// ----------------------------------
			//         expense:create
			// ----------------------------------
			{
				displayName: 'Currency Name or ID',
				name: 'currencyId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getCurrencies',
				},
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['expense'],
						operation: ['create'],
					},
				},
				description: 'Currency for the expense. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
			},
			{
				displayName: 'Line Items',
				name: 'lineItems',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				required: true,
				default: {},
				displayOptions: {
					show: {
						resource: ['expense'],
						operation: ['create'],
					},
				},
				placeholder: 'Add Line Item',
				options: [
					{
						name: 'lineItemValues',
						displayName: 'Line Item',
						values: [
							{
								displayName: 'Category Name or ID',
								name: 'category_id',
								type: 'options',
								typeOptions: {
									loadOptionsMethod: 'getCategories',
								},
								required: true,
								default: '',
								description: 'Expense category. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
							},
							{
								displayName: 'Amount',
								name: 'amount',
								type: 'number',
								required: true,
								default: 0,
								description: 'Amount for this line item',
							},
							{
								displayName: 'Description',
								name: 'description',
								type: 'string',
								default: '',
								description: 'Description for this line item',
							},
							{
								displayName: 'Tax Name or ID',
								name: 'tax_id',
								type: 'options',
								typeOptions: {
									loadOptionsMethod: 'getTaxes',
								},
								default: '',
								description: 'Tax to apply. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
							},
							{
								displayName: 'Tags',
								name: 'tags',
								type: 'fixedCollection',
								typeOptions: {
									multipleValues: true,
								},
								default: {},
								placeholder: 'Add Tag',
								options: [
									{
										name: 'tagValues',
										displayName: 'Tag',
										values: [
											{
												displayName: 'Tag ID',
												name: 'tag_id',
												type: 'string',
												default: '',
												description: 'Unique ID for the tag',
											},
											{
												displayName: 'Tag Option ID',
												name: 'tag_option_id',
												type: 'string',
												default: '',
												description: 'Unique ID for the tag option',
											},
										],
									},
								],
							},
						],
					},
				],
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['expense'],
						operation: ['create'],
					},
				},
				options: [
					{
						displayName: 'Attendees',
						name: 'attendees',
						type: 'fixedCollection',
						typeOptions: {
							multipleValues: true,
						},
						default: {},
						placeholder: 'Add Attendee',
						options: [
							{
								name: 'attendeeValues',
								displayName: 'Attendee',
								values: [
									{
										displayName: 'User Name or ID',
										name: 'user_id',
										type: 'options',
										typeOptions: {
											loadOptionsMethod: 'getUsers',
										},
										default: '',
										description: 'User to add as attendee. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
									},
								],
							},
						],
					},
					{
						displayName: 'Custom Fields',
						name: 'custom_fields',
						type: 'fixedCollection',
						typeOptions: {
							multipleValues: true,
						},
						default: {},
						placeholder: 'Add Custom Field',
						options: [
							{
								name: 'customFieldValues',
								displayName: 'Custom Field',
								values: [
									{
										displayName: 'Custom Field ID',
										name: 'customfield_id',
										type: 'string',
										default: '',
										description: 'Unique ID for the custom field',
									},
									{
										displayName: 'Value',
										name: 'value',
										type: 'string',
										default: '',
										description: 'Value for the custom field',
									},
								],
							},
						],
					},
					{
						displayName: 'Customer Name or ID',
						name: 'customer_id',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getCustomers',
						},
						default: '',
						description: 'Customer associated with the expense. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
					},
					{
						displayName: 'Date',
						name: 'date',
						type: 'dateTime',
						default: '',
						description: 'Date of the expense (YYYY-MM-DD)',
					},
					{
						displayName: 'Distance',
						name: 'distance',
						type: 'number',
						default: 0,
						description: 'Distance travelled (for mileage expenses)',
					},
					{
						displayName: 'Is Billable',
						name: 'is_billable',
						type: 'boolean',
						default: false,
						description: 'Whether the expense is billable',
					},
					{
						displayName: 'Is Inclusive Tax',
						name: 'is_inclusive_tax',
						type: 'boolean',
						default: false,
						description: 'Whether the expense amount is inclusive of tax',
					},
					{
						displayName: 'Is Reimbursable',
						name: 'is_reimbursable',
						type: 'boolean',
						default: true,
						description: 'Whether the expense is reimbursable',
					},
					{
						displayName: 'Merchant Name or ID',
						name: 'merchant_id',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getMerchants',
						},
						default: '',
						description: 'Merchant for the expense. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
					},
					{
						displayName: 'Paid Through Account Name or ID',
						name: 'paid_through_account_id',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getAccounts',
						},
						default: '',
						description: 'Account through which the expense was paid. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
					},
					{
						displayName: 'Payment Mode',
						name: 'payment_mode',
						type: 'string',
						default: '',
						description: 'Payment mode (e.g., Cash, Check, Credit Card)',
					},
					{
						displayName: 'Project Name or ID',
						name: 'project_id',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getProjects',
						},
						default: '',
						description: 'Project associated with the expense. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
					},
					{
						displayName: 'Report Name or ID',
						name: 'report_id',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getReports',
						},
						default: '',
						description: 'Report to add the expense to. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
					},
				],
			},

			// ----------------------------------
			//         expense:getAll
			// ----------------------------------
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['expense'],
						operation: ['getAll'],
					},
				},
				default: false,
				description: 'Whether to return all results or only up to a given limit',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['expense'],
						operation: ['getAll'],
						returnAll: [false],
					},
				},
				typeOptions: {
					minValue: 1,
					maxValue: 200,
				},
				default: 50,
				description: 'Max number of results to return',
			},
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'collection',
				placeholder: 'Add Filter',
				default: {},
				displayOptions: {
					show: {
						resource: ['expense'],
						operation: ['getAll'],
					},
				},
				options: [
					{
						displayName: 'Category Name or ID',
						name: 'category_id',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getCategories',
						},
						default: '',
						description: 'Filter by expense category. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
					},
					{
						displayName: 'Customer Name or ID',
						name: 'customer_id',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getCustomers',
						},
						default: '',
						description: 'Filter by customer. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
					},
					{
						displayName: 'Date End',
						name: 'date_end',
						type: 'dateTime',
						default: '',
						description: 'Ending date for filtering expenses',
					},
					{
						displayName: 'Date Start',
						name: 'date_start',
						type: 'dateTime',
						default: '',
						description: 'Starting date for filtering expenses',
					},
					{
						displayName: 'Merchant Name or ID',
						name: 'merchant_id',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getMerchants',
						},
						default: '',
						description: 'Filter by merchant. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
					},
					{
						displayName: 'Project Name or ID',
						name: 'project_id',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getProjects',
						},
						default: '',
						description: 'Filter by project. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
					},
					{
						displayName: 'Status',
						name: 'status',
						type: 'options',
						options: [
							{
								name: 'All',
								value: '',
							},
							{
								name: 'Approved',
								value: 'approved',
							},
							{
								name: 'Draft',
								value: 'draft',
							},
							{
								name: 'Partially Approved',
								value: 'partially_approved',
							},
							{
								name: 'Recalled',
								value: 'recalled',
							},
							{
								name: 'Reimbursed',
								value: 'reimbursed',
							},
							{
								name: 'Rejected',
								value: 'rejected',
							},
							{
								name: 'Submitted',
								value: 'submitted',
							},
							{
								name: 'Unreported',
								value: 'unreported',
							},
						],
						default: '',
						description: 'Status of the expense report with which the expense is associated',
					},
					{
						displayName: 'User Name or ID',
						name: 'user_id',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getUsers',
						},
						default: '',
						description: 'Filter by user who created the expense. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
					},
				],
			},

			// ----------------------------------
			//         expense:update
			// ----------------------------------
			{
				displayName: 'Expense ID',
				name: 'expenseId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['expense'],
						operation: ['update'],
					},
				},
				description: 'Unique identifier of the expense to update',
			},
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['expense'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Attendees',
						name: 'attendees',
						type: 'fixedCollection',
						typeOptions: {
							multipleValues: true,
						},
						default: {},
						placeholder: 'Add Attendee',
						options: [
							{
								name: 'attendeeValues',
								displayName: 'Attendee',
								values: [
									{
										displayName: 'Attendee ID',
										name: 'attendee_id',
										type: 'string',
										default: '',
										description: 'Existing attendee ID (for updates)',
									},
									{
										displayName: 'User Name or ID',
										name: 'user_id',
										type: 'options',
										typeOptions: {
											loadOptionsMethod: 'getUsers',
										},
										default: '',
										description: 'User to add as attendee. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
									},
								],
							},
						],
					},
					{
						displayName: 'Currency Name or ID',
						name: 'currency_id',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getCurrencies',
						},
						default: '',
						description: 'Currency for the expense. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
					},
					{
						displayName: 'Custom Fields',
						name: 'custom_fields',
						type: 'fixedCollection',
						typeOptions: {
							multipleValues: true,
						},
						default: {},
						placeholder: 'Add Custom Field',
						options: [
							{
								name: 'customFieldValues',
								displayName: 'Custom Field',
								values: [
									{
										displayName: 'Custom Field ID',
										name: 'customfield_id',
										type: 'string',
										default: '',
										description: 'Unique ID for the custom field',
									},
									{
										displayName: 'Value',
										name: 'value',
										type: 'string',
										default: '',
										description: 'Value for the custom field',
									},
								],
							},
						],
					},
					{
						displayName: 'Customer Name or ID',
						name: 'customer_id',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getCustomers',
						},
						default: '',
						description: 'Customer associated with the expense. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
					},
					{
						displayName: 'Date',
						name: 'date',
						type: 'dateTime',
						default: '',
						description: 'Date of the expense (YYYY-MM-DD)',
					},
					{
						displayName: 'Is Billable',
						name: 'is_billable',
						type: 'boolean',
						default: false,
						description: 'Whether the expense is billable',
					},
					{
						displayName: 'Is Inclusive Tax',
						name: 'is_inclusive_tax',
						type: 'boolean',
						default: false,
						description: 'Whether the expense amount is inclusive of tax',
					},
					{
						displayName: 'Is Reimbursable',
						name: 'is_reimbursable',
						type: 'boolean',
						default: true,
						description: 'Whether the expense is reimbursable',
					},
					{
						displayName: 'Line Items',
						name: 'line_items',
						type: 'fixedCollection',
						typeOptions: {
							multipleValues: true,
						},
						default: {},
						placeholder: 'Add Line Item',
						options: [
							{
								name: 'lineItemValues',
								displayName: 'Line Item',
								values: [
									{
										displayName: 'Line Item ID',
										name: 'line_item_id',
										type: 'string',
										default: '',
										description: 'Existing line item ID (for updates)',
									},
									{
										displayName: 'Category Name or ID',
										name: 'category_id',
										type: 'options',
										typeOptions: {
											loadOptionsMethod: 'getCategories',
										},
										default: '',
										description: 'Expense category. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
									},
									{
										displayName: 'Amount',
										name: 'amount',
										type: 'number',
										default: 0,
										description: 'Amount for this line item',
									},
									{
										displayName: 'Description',
										name: 'description',
										type: 'string',
										default: '',
										description: 'Description for this line item',
									},
									{
										displayName: 'Tax Name or ID',
										name: 'tax_id',
										type: 'options',
										typeOptions: {
											loadOptionsMethod: 'getTaxes',
										},
										default: '',
										description: 'Tax to apply. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
									},
									{
										displayName: 'Item Order',
										name: 'item_order',
										type: 'number',
										default: 0,
										description: 'Order of the line item',
									},
									{
										displayName: 'Tags',
										name: 'tags',
										type: 'fixedCollection',
										typeOptions: {
											multipleValues: true,
										},
										default: {},
										placeholder: 'Add Tag',
										options: [
											{
												name: 'tagValues',
												displayName: 'Tag',
												values: [
													{
														displayName: 'Tag ID',
														name: 'tag_id',
														type: 'string',
														default: '',
														description: 'Unique ID for the tag',
													},
													{
														displayName: 'Tag Option ID',
														name: 'tag_option_id',
														type: 'string',
														default: '',
														description: 'Unique ID for the tag option',
													},
												],
											},
										],
									},
								],
							},
						],
					},
					{
						displayName: 'Merchant Name or ID',
						name: 'merchant_id',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getMerchants',
						},
						default: '',
						description: 'Merchant for the expense. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
					},
					{
						displayName: 'Paid Through Account Name or ID',
						name: 'paid_through_account_id',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getAccounts',
						},
						default: '',
						description: 'Account through which the expense was paid. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
					},
					{
						displayName: 'Payment Mode',
						name: 'payment_mode',
						type: 'string',
						default: '',
						description: 'Payment mode (e.g., Cash, Check, Credit Card)',
					},
					{
						displayName: 'Project Name or ID',
						name: 'project_id',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getProjects',
						},
						default: '',
						description: 'Project associated with the expense. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
					},
					{
						displayName: 'Report Name or ID',
						name: 'report_id',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getReports',
						},
						default: '',
						description: 'Report to add the expense to. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
					},
				],
			},

			// ----------------------------------
			//         expense:merge
			// ----------------------------------
			{
				displayName: 'Expense ID',
				name: 'expenseId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['expense'],
						operation: ['merge'],
					},
				},
				description: 'Unique identifier of the primary expense (expenses will be merged into this one)',
			},
			{
				displayName: 'Duplicate Expense ID',
				name: 'duplicateExpenseId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['expense'],
						operation: ['merge'],
					},
				},
				description: 'Unique identifier of the duplicate expense to merge',
			},

			// ========================================
			//         EXPENSE REPORT FIELDS
			// ========================================

			// ----------------------------------
			//         expenseReport:get
			// ----------------------------------
			{
				displayName: 'Report ID',
				name: 'reportId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['expenseReport'],
						operation: ['get', 'delete', 'update', 'submit', 'approve', 'reject', 'recall'],
					},
				},
				description: 'Unique identifier of the expense report',
			},

			// ----------------------------------
			//         expenseReport:getAll
			// ----------------------------------
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['expenseReport'],
						operation: ['getAll'],
					},
				},
				default: false,
				description: 'Whether to return all results or only up to a given limit',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['expenseReport'],
						operation: ['getAll'],
						returnAll: [false],
					},
				},
				typeOptions: {
					minValue: 1,
					maxValue: 200,
				},
				default: 50,
				description: 'Max number of results to return',
			},
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'collection',
				placeholder: 'Add Filter',
				default: {},
				displayOptions: {
					show: {
						resource: ['expenseReport'],
						operation: ['getAll'],
					},
				},
				options: [
					{
						displayName: 'Status',
						name: 'status',
						type: 'options',
						options: [
							{ name: 'All', value: '' },
							{ name: 'Approved', value: 'approved' },
							{ name: 'Draft', value: 'draft' },
							{ name: 'Partially Approved', value: 'partially_approved' },
							{ name: 'Recalled', value: 'recalled' },
							{ name: 'Reimbursed', value: 'reimbursed' },
							{ name: 'Rejected', value: 'rejected' },
							{ name: 'Submitted', value: 'submitted' },
						],
						default: '',
						description: 'Filter by report status',
					},
					{
						displayName: 'User Name or ID',
						name: 'user_id',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getUsers',
						},
						default: '',
						description: 'Filter by user. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
					},
				],
			},

			// ----------------------------------
			//         expenseReport:create
			// ----------------------------------
			{
				displayName: 'Report Name',
				name: 'reportName',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['expenseReport'],
						operation: ['create'],
					},
				},
				description: 'Name for the expense report',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['expenseReport'],
						operation: ['create'],
					},
				},
				options: [
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'Description for the report',
					},
					{
						displayName: 'Start Date',
						name: 'start_date',
						type: 'dateTime',
						default: '',
						description: 'Start date of the report period',
					},
					{
						displayName: 'End Date',
						name: 'end_date',
						type: 'dateTime',
						default: '',
						description: 'End date of the report period',
					},
					{
						displayName: 'Trip Name or ID',
						name: 'trip_id',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getTrips',
						},
						default: '',
						description: 'Trip associated with the report. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
					},
				],
			},

			// ----------------------------------
			//         expenseReport:update
			// ----------------------------------
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['expenseReport'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'Description for the report',
					},
					{
						displayName: 'Report Name',
						name: 'report_name',
						type: 'string',
						default: '',
						description: 'Name for the expense report',
					},
					{
						displayName: 'Start Date',
						name: 'start_date',
						type: 'dateTime',
						default: '',
						description: 'Start date of the report period',
					},
					{
						displayName: 'End Date',
						name: 'end_date',
						type: 'dateTime',
						default: '',
						description: 'End date of the report period',
					},
				],
			},

			// ----------------------------------
			//         expenseReport:approve/reject
			// ----------------------------------
			{
				displayName: 'Comments',
				name: 'comments',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['expenseReport'],
						operation: ['approve', 'reject'],
					},
				},
				description: 'Comments for the approval/rejection',
			},

			// ========================================
			//         TRIP FIELDS
			// ========================================

			// ----------------------------------
			//         trip:get/delete/update
			// ----------------------------------
			{
				displayName: 'Trip ID',
				name: 'tripId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['trip'],
						operation: ['get', 'delete', 'update'],
					},
				},
				description: 'Unique identifier of the trip',
			},

			// ----------------------------------
			//         trip:getAll
			// ----------------------------------
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['trip'],
						operation: ['getAll'],
					},
				},
				default: false,
				description: 'Whether to return all results or only up to a given limit',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['trip'],
						operation: ['getAll'],
						returnAll: [false],
					},
				},
				typeOptions: {
					minValue: 1,
					maxValue: 200,
				},
				default: 50,
				description: 'Max number of results to return',
			},

			// ----------------------------------
			//         trip:create
			// ----------------------------------
			{
				displayName: 'Trip Name',
				name: 'tripName',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['trip'],
						operation: ['create'],
					},
				},
				description: 'Name for the trip',
			},
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'dateTime',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['trip'],
						operation: ['create'],
					},
				},
				description: 'Start date of the trip',
			},
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'dateTime',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['trip'],
						operation: ['create'],
					},
				},
				description: 'End date of the trip',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['trip'],
						operation: ['create'],
					},
				},
				options: [
					{
						displayName: 'Budget',
						name: 'budget',
						type: 'number',
						default: 0,
						description: 'Budget for the trip',
					},
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'Description for the trip',
					},
					{
						displayName: 'Destination',
						name: 'destination',
						type: 'string',
						default: '',
						description: 'Destination of the trip',
					},
				],
			},

			// ----------------------------------
			//         trip:update
			// ----------------------------------
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['trip'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Budget',
						name: 'budget',
						type: 'number',
						default: 0,
						description: 'Budget for the trip',
					},
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'Description for the trip',
					},
					{
						displayName: 'Destination',
						name: 'destination',
						type: 'string',
						default: '',
						description: 'Destination of the trip',
					},
					{
						displayName: 'End Date',
						name: 'end_date',
						type: 'dateTime',
						default: '',
						description: 'End date of the trip',
					},
					{
						displayName: 'Start Date',
						name: 'start_date',
						type: 'dateTime',
						default: '',
						description: 'Start date of the trip',
					},
					{
						displayName: 'Trip Name',
						name: 'trip_name',
						type: 'string',
						default: '',
						description: 'Name for the trip',
					},
				],
			},

			// ========================================
			//         USER FIELDS
			// ========================================

			// ----------------------------------
			//         user:get
			// ----------------------------------
			{
				displayName: 'User ID',
				name: 'userId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['get'],
					},
				},
				description: 'Unique identifier of the user',
			},

			// ----------------------------------
			//         user:getAll
			// ----------------------------------
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['getAll'],
					},
				},
				default: false,
				description: 'Whether to return all results or only up to a given limit',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['getAll'],
						returnAll: [false],
					},
				},
				typeOptions: {
					minValue: 1,
					maxValue: 200,
				},
				default: 50,
				description: 'Max number of results to return',
			},
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'collection',
				placeholder: 'Add Filter',
				default: {},
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['getAll'],
					},
				},
				options: [
					{
						displayName: 'Role',
						name: 'role',
						type: 'options',
						options: [
							{ name: 'All', value: '' },
							{ name: 'Admin', value: 'admin' },
							{ name: 'Approver', value: 'approver' },
							{ name: 'Submitter', value: 'submitter' },
						],
						default: '',
						description: 'Filter by user role',
					},
					{
						displayName: 'Status',
						name: 'status',
						type: 'options',
						options: [
							{ name: 'All', value: '' },
							{ name: 'Active', value: 'active' },
							{ name: 'Inactive', value: 'inactive' },
						],
						default: '',
						description: 'Filter by user status',
					},
				],
			},

			// ========================================
			//         CATEGORY FIELDS
			// ========================================

			// ----------------------------------
			//         category:get
			// ----------------------------------
			{
				displayName: 'Category ID',
				name: 'categoryId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['category'],
						operation: ['get'],
					},
				},
				description: 'Unique identifier of the expense category',
			},

			// ----------------------------------
			//         category:getAll
			// ----------------------------------
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['category'],
						operation: ['getAll'],
					},
				},
				default: false,
				description: 'Whether to return all results or only up to a given limit',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['category'],
						operation: ['getAll'],
						returnAll: [false],
					},
				},
				typeOptions: {
					minValue: 1,
					maxValue: 200,
				},
				default: 50,
				description: 'Max number of results to return',
			},
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'collection',
				placeholder: 'Add Filter',
				default: {},
				displayOptions: {
					show: {
						resource: ['category'],
						operation: ['getAll'],
					},
				},
				options: [
					{
						displayName: 'Is Enabled',
						name: 'is_enabled',
						type: 'boolean',
						default: true,
						description: 'Whether to filter by enabled categories only',
					},
				],
			},
		],
	};

	methods = {
		loadOptions: {
			async getOrganizations(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const response = await zohoExpenseApiRequest.call(this, 'GET', '/organizations');
				const organizations = response.organizations as IDataObject[];

				if (organizations) {
					for (const org of organizations) {
						returnData.push({
							name: org.name as string,
							value: org.organization_id as string,
						});
					}
				}

				return returnData;
			},

			async getCurrencies(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const organizationId = this.getCurrentNodeParameter('organizationId') as string;

				const response = await zohoExpenseApiRequest.call(
					this,
					'GET',
					'/settings/currencies',
					{},
					{},
				);

				const currencies = response.currencies as IDataObject[];

				if (currencies) {
					for (const currency of currencies) {
						returnData.push({
							name: `${currency.currency_code} - ${currency.currency_name}`,
							value: currency.currency_id as string,
						});
					}
				}

				return returnData;
			},

			async getCategories(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];

				const response = await zohoExpenseApiRequest.call(
					this,
					'GET',
					'/expensecategories',
				);

				const categories = response.expense_categories as IDataObject[];

				if (categories) {
					for (const category of categories) {
						returnData.push({
							name: category.category_name as string,
							value: category.category_id as string,
						});
					}
				}

				return returnData;
			},

			async getTaxes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];

				const response = await zohoExpenseApiRequest.call(
					this,
					'GET',
					'/settings/taxes',
				);

				const taxes = response.taxes as IDataObject[];

				if (taxes) {
					for (const tax of taxes) {
						returnData.push({
							name: `${tax.tax_name} (${tax.tax_percentage}%)`,
							value: tax.tax_id as string,
						});
					}
				}

				return returnData;
			},

			async getMerchants(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];

				const response = await zohoExpenseApiRequest.call(
					this,
					'GET',
					'/merchants',
				);

				const merchants = response.merchants as IDataObject[];

				if (merchants) {
					for (const merchant of merchants) {
						returnData.push({
							name: merchant.merchant_name as string,
							value: merchant.merchant_id as string,
						});
					}
				}

				return returnData;
			},

			async getCustomers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];

				const response = await zohoExpenseApiRequest.call(
					this,
					'GET',
					'/customers',
				);

				const customers = response.customers as IDataObject[];

				if (customers) {
					for (const customer of customers) {
						returnData.push({
							name: customer.customer_name as string,
							value: customer.customer_id as string,
						});
					}
				}

				return returnData;
			},

			async getProjects(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];

				const response = await zohoExpenseApiRequest.call(
					this,
					'GET',
					'/projects',
				);

				const projects = response.projects as IDataObject[];

				if (projects) {
					for (const project of projects) {
						returnData.push({
							name: project.project_name as string,
							value: project.project_id as string,
						});
					}
				}

				return returnData;
			},

			async getUsers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];

				const response = await zohoExpenseApiRequest.call(
					this,
					'GET',
					'/users',
				);

				const users = response.users as IDataObject[];

				if (users) {
					for (const user of users) {
						returnData.push({
							name: user.name as string,
							value: user.user_id as string,
						});
					}
				}

				return returnData;
			},

			async getAccounts(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];

				const response = await zohoExpenseApiRequest.call(
					this,
					'GET',
					'/settings/accounts',
				);

				const accounts = response.accounts as IDataObject[];

				if (accounts) {
					for (const account of accounts) {
						returnData.push({
							name: account.account_name as string,
							value: account.account_id as string,
						});
					}
				}

				return returnData;
			},

			async getReports(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];

				const response = await zohoExpenseApiRequest.call(
					this,
					'GET',
					'/expensereports',
				);

				const reports = response.expense_reports as IDataObject[];

				if (reports) {
					for (const report of reports) {
						returnData.push({
							name: report.report_name as string,
							value: report.report_id as string,
						});
					}
				}

				return returnData;
			},

			async getTrips(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];

				const response = await zohoExpenseApiRequest.call(
					this,
					'GET',
					'/trips',
				);

				const trips = response.trips as IDataObject[];

				if (trips) {
					for (const trip of trips) {
						returnData.push({
							name: trip.trip_name as string,
							value: trip.trip_id as string,
						});
					}
				}

				return returnData;
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: IDataObject | IDataObject[] = {};

				if (resource === 'expense') {
					// ----------------------------------
					//         expense:get
					// ----------------------------------
					if (operation === 'get') {
						const expenseId = this.getNodeParameter('expenseId', i) as string;

						const response = await zohoExpenseApiRequest.call(
							this,
							'GET',
							`/expenses/${expenseId}`,
							{},
							{},
						);

						responseData = (response.expense as IDataObject) ?? response;
					}

					// ----------------------------------
					//         expense:delete
					// ----------------------------------
					if (operation === 'delete') {
						const expenseId = this.getNodeParameter('expenseId', i) as string;

						const response = await zohoExpenseApiRequest.call(
							this,
							'DELETE',
							`/expenses/${expenseId}`,
							{},
							{},
						);

						responseData = response;
					}

					// ----------------------------------
					//         expense:create
					// ----------------------------------
					if (operation === 'create') {
						const currencyId = this.getNodeParameter('currencyId', i) as string;
						const lineItemsInput = this.getNodeParameter('lineItems.lineItemValues', i, []) as IDataObject[];
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							currency_id: currencyId,
							line_items: lineItemsInput.map((item) => {
								const lineItem: IDataObject = {
									category_id: item.category_id,
									amount: item.amount,
								};

								if (item.description) {
									lineItem.description = item.description;
								}

								if (item.tax_id) {
									lineItem.tax_id = item.tax_id;
								}

								// Handle tags
								if (item.tags && (item.tags as IDataObject).tagValues) {
									lineItem.tags = (item.tags as IDataObject).tagValues;
								}

								return lineItem;
							}),
						};

						// Handle date formatting
						if (additionalFields.date) {
							body.date = (additionalFields.date as string).split('T')[0];
							delete additionalFields.date;
						}

						// Handle attendees
						if (additionalFields.attendees && (additionalFields.attendees as IDataObject).attendeeValues) {
							body.attendees = (additionalFields.attendees as IDataObject).attendeeValues;
							delete additionalFields.attendees;
						}

						// Handle custom fields
						if (additionalFields.custom_fields && (additionalFields.custom_fields as IDataObject).customFieldValues) {
							body.custom_fields = (additionalFields.custom_fields as IDataObject).customFieldValues;
							delete additionalFields.custom_fields;
						}

						// Add remaining additional fields
						Object.assign(body, additionalFields);

						const response = await zohoExpenseApiRequest.call(
							this,
							'POST',
							'/expenses',
							body,
							{},
						);

						responseData = (response.expenses as IDataObject[]) ?? response;
					}

					// ----------------------------------
					//         expense:getAll
					// ----------------------------------
					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;

						const qs: IDataObject = {};

						// Handle date formatting for filters
						if (filters.date_start) {
							qs.date_start = (filters.date_start as string).split('T')[0];
							delete filters.date_start;
						}

						if (filters.date_end) {
							qs.date_end = (filters.date_end as string).split('T')[0];
							delete filters.date_end;
						}

						// Add remaining filters
						Object.assign(qs, filters);

						if (returnAll) {
							responseData = await zohoExpenseApiRequestAllItems.call(
								this,
								'GET',
								'/reports/expensedetails',
								{},
								qs,
								'expenses',
							);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.per_page = limit;
							qs.page = 1;

							const response = await zohoExpenseApiRequest.call(
								this,
								'GET',
								'/reports/expensedetails',
								{},
								qs,
							);

							responseData = response.expenses as IDataObject[];
						}
					}

					// ----------------------------------
					//         expense:update
					// ----------------------------------
					if (operation === 'update') {
						const expenseId = this.getNodeParameter('expenseId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

						const body: IDataObject = {};

						// Handle date formatting
						if (updateFields.date) {
							body.date = (updateFields.date as string).split('T')[0];
							delete updateFields.date;
						}

						// Handle line items
						if (updateFields.line_items && (updateFields.line_items as IDataObject).lineItemValues) {
							body.line_items = ((updateFields.line_items as IDataObject).lineItemValues as IDataObject[]).map((item) => {
								const lineItem: IDataObject = {};

								if (item.line_item_id) {
									lineItem.line_item_id = item.line_item_id;
								}

								if (item.category_id) {
									lineItem.category_id = item.category_id;
								}

								if (item.amount !== undefined) {
									lineItem.amount = item.amount;
								}

								if (item.description) {
									lineItem.description = item.description;
								}

								if (item.tax_id) {
									lineItem.tax_id = item.tax_id;
								}

								if (item.item_order !== undefined) {
									lineItem.item_order = item.item_order;
								}

								// Handle tags
								if (item.tags && (item.tags as IDataObject).tagValues) {
									lineItem.tags = (item.tags as IDataObject).tagValues;
								}

								return lineItem;
							});
							delete updateFields.line_items;
						}

						// Handle attendees
						if (updateFields.attendees && (updateFields.attendees as IDataObject).attendeeValues) {
							body.attendees = (updateFields.attendees as IDataObject).attendeeValues;
							delete updateFields.attendees;
						}

						// Handle custom fields
						if (updateFields.custom_fields && (updateFields.custom_fields as IDataObject).customFieldValues) {
							body.custom_fields = (updateFields.custom_fields as IDataObject).customFieldValues;
							delete updateFields.custom_fields;
						}

						// Add remaining update fields
						Object.assign(body, updateFields);

						const response = await zohoExpenseApiRequest.call(
							this,
							'PUT',
							`/expenses/${expenseId}`,
							body,
							{},
						);

						responseData = (response.expense as IDataObject) ?? response;
					}

					// ----------------------------------
					//         expense:merge
					// ----------------------------------
					if (operation === 'merge') {
						const expenseId = this.getNodeParameter('expenseId', i) as string;
						const duplicateExpenseId = this.getNodeParameter('duplicateExpenseId', i) as string;

						const response = await zohoExpenseApiRequest.call(
							this,
							'POST',
							`/expenses/${expenseId}/merge`,
							{},
							{ duplicate_expense_id: duplicateExpenseId },
						);

						responseData = response;
					}
				}

				// ========================================
				//         EXPENSE REPORT RESOURCE
				// ========================================
				if (resource === 'expenseReport') {
					// ----------------------------------
					//         expenseReport:get
					// ----------------------------------
					if (operation === 'get') {
						const reportId = this.getNodeParameter('reportId', i) as string;

						const response = await zohoExpenseApiRequest.call(
							this,
							'GET',
							`/expensereports/${reportId}`,
							{},
							{},
						);

						responseData = (response.expense_report as IDataObject) ?? response;
					}

					// ----------------------------------
					//         expenseReport:getAll
					// ----------------------------------
					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;

						const qs: IDataObject = {};
						Object.assign(qs, filters);

						if (returnAll) {
							responseData = await zohoExpenseApiRequestAllItems.call(
								this,
								'GET',
								'/expensereports',
								{},
								qs,
								'expense_reports',
							);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.per_page = limit;
							qs.page = 1;

							const response = await zohoExpenseApiRequest.call(
								this,
								'GET',
								'/expensereports',
								{},
								qs,
							);

							responseData = response.expense_reports as IDataObject[];
						}
					}

					// ----------------------------------
					//         expenseReport:create
					// ----------------------------------
					if (operation === 'create') {
						const reportName = this.getNodeParameter('reportName', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							report_name: reportName,
						};

						// Handle date formatting
						if (additionalFields.start_date) {
							body.start_date = (additionalFields.start_date as string).split('T')[0];
							delete additionalFields.start_date;
						}
						if (additionalFields.end_date) {
							body.end_date = (additionalFields.end_date as string).split('T')[0];
							delete additionalFields.end_date;
						}

						Object.assign(body, additionalFields);

						const response = await zohoExpenseApiRequest.call(
							this,
							'POST',
							'/expensereports',
							body,
							{},
						);

						responseData = (response.expense_report as IDataObject) ?? response;
					}

					// ----------------------------------
					//         expenseReport:update
					// ----------------------------------
					if (operation === 'update') {
						const reportId = this.getNodeParameter('reportId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

						const body: IDataObject = {};

						// Handle date formatting
						if (updateFields.start_date) {
							body.start_date = (updateFields.start_date as string).split('T')[0];
							delete updateFields.start_date;
						}
						if (updateFields.end_date) {
							body.end_date = (updateFields.end_date as string).split('T')[0];
							delete updateFields.end_date;
						}

						Object.assign(body, updateFields);

						const response = await zohoExpenseApiRequest.call(
							this,
							'PUT',
							`/expensereports/${reportId}`,
							body,
							{},
						);

						responseData = (response.expense_report as IDataObject) ?? response;
					}

					// ----------------------------------
					//         expenseReport:delete
					// ----------------------------------
					if (operation === 'delete') {
						const reportId = this.getNodeParameter('reportId', i) as string;

						const response = await zohoExpenseApiRequest.call(
							this,
							'DELETE',
							`/expensereports/${reportId}`,
							{},
							{},
						);

						responseData = response;
					}

					// ----------------------------------
					//         expenseReport:submit
					// ----------------------------------
					if (operation === 'submit') {
						const reportId = this.getNodeParameter('reportId', i) as string;

						const response = await zohoExpenseApiRequest.call(
							this,
							'POST',
							`/expensereports/${reportId}/submit`,
							{},
							{},
						);

						responseData = response;
					}

					// ----------------------------------
					//         expenseReport:approve
					// ----------------------------------
					if (operation === 'approve') {
						const reportId = this.getNodeParameter('reportId', i) as string;
						const comments = this.getNodeParameter('comments', i, '') as string;

						const body: IDataObject = {};
						if (comments) {
							body.comments = comments;
						}

						const response = await zohoExpenseApiRequest.call(
							this,
							'POST',
							`/expensereports/${reportId}/approve`,
							body,
							{},
						);

						responseData = response;
					}

					// ----------------------------------
					//         expenseReport:reject
					// ----------------------------------
					if (operation === 'reject') {
						const reportId = this.getNodeParameter('reportId', i) as string;
						const comments = this.getNodeParameter('comments', i, '') as string;

						const body: IDataObject = {};
						if (comments) {
							body.comments = comments;
						}

						const response = await zohoExpenseApiRequest.call(
							this,
							'POST',
							`/expensereports/${reportId}/reject`,
							body,
							{},
						);

						responseData = response;
					}

					// ----------------------------------
					//         expenseReport:recall
					// ----------------------------------
					if (operation === 'recall') {
						const reportId = this.getNodeParameter('reportId', i) as string;

						const response = await zohoExpenseApiRequest.call(
							this,
							'POST',
							`/expensereports/${reportId}/recall`,
							{},
							{},
						);

						responseData = response;
					}
				}

				// ========================================
				//         TRIP RESOURCE
				// ========================================
				if (resource === 'trip') {
					// ----------------------------------
					//         trip:get
					// ----------------------------------
					if (operation === 'get') {
						const tripId = this.getNodeParameter('tripId', i) as string;

						const response = await zohoExpenseApiRequest.call(
							this,
							'GET',
							`/trips/${tripId}`,
							{},
							{},
						);

						responseData = (response.trip as IDataObject) ?? response;
					}

					// ----------------------------------
					//         trip:getAll
					// ----------------------------------
					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;

						const qs: IDataObject = {};

						if (returnAll) {
							responseData = await zohoExpenseApiRequestAllItems.call(
								this,
								'GET',
								'/trips',
								{},
								qs,
								'trips',
							);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.per_page = limit;
							qs.page = 1;

							const response = await zohoExpenseApiRequest.call(
								this,
								'GET',
								'/trips',
								{},
								qs,
							);

							responseData = response.trips as IDataObject[];
						}
					}

					// ----------------------------------
					//         trip:create
					// ----------------------------------
					if (operation === 'create') {
						const tripName = this.getNodeParameter('tripName', i) as string;
						const startDate = this.getNodeParameter('startDate', i) as string;
						const endDate = this.getNodeParameter('endDate', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							trip_name: tripName,
							start_date: startDate.split('T')[0],
							end_date: endDate.split('T')[0],
						};

						Object.assign(body, additionalFields);

						const response = await zohoExpenseApiRequest.call(
							this,
							'POST',
							'/trips',
							body,
							{},
						);

						responseData = (response.trip as IDataObject) ?? response;
					}

					// ----------------------------------
					//         trip:update
					// ----------------------------------
					if (operation === 'update') {
						const tripId = this.getNodeParameter('tripId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

						const body: IDataObject = {};

						// Handle date formatting
						if (updateFields.start_date) {
							body.start_date = (updateFields.start_date as string).split('T')[0];
							delete updateFields.start_date;
						}
						if (updateFields.end_date) {
							body.end_date = (updateFields.end_date as string).split('T')[0];
							delete updateFields.end_date;
						}

						Object.assign(body, updateFields);

						const response = await zohoExpenseApiRequest.call(
							this,
							'PUT',
							`/trips/${tripId}`,
							body,
							{},
						);

						responseData = (response.trip as IDataObject) ?? response;
					}

					// ----------------------------------
					//         trip:delete
					// ----------------------------------
					if (operation === 'delete') {
						const tripId = this.getNodeParameter('tripId', i) as string;

						const response = await zohoExpenseApiRequest.call(
							this,
							'DELETE',
							`/trips/${tripId}`,
							{},
							{},
						);

						responseData = response;
					}
				}

				// ========================================
				//         USER RESOURCE
				// ========================================
				if (resource === 'user') {
					// ----------------------------------
					//         user:get
					// ----------------------------------
					if (operation === 'get') {
						const userId = this.getNodeParameter('userId', i) as string;

						const response = await zohoExpenseApiRequest.call(
							this,
							'GET',
							`/users/${userId}`,
							{},
							{},
						);

						responseData = (response.user as IDataObject) ?? response;
					}

					// ----------------------------------
					//         user:getAll
					// ----------------------------------
					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;

						const qs: IDataObject = {};
						Object.assign(qs, filters);

						if (returnAll) {
							responseData = await zohoExpenseApiRequestAllItems.call(
								this,
								'GET',
								'/users',
								{},
								qs,
								'users',
							);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.per_page = limit;
							qs.page = 1;

							const response = await zohoExpenseApiRequest.call(
								this,
								'GET',
								'/users',
								{},
								qs,
							);

							responseData = response.users as IDataObject[];
						}
					}
				}

				// ========================================
				//         CATEGORY RESOURCE
				// ========================================
				if (resource === 'category') {
					// ----------------------------------
					//         category:get
					// ----------------------------------
					if (operation === 'get') {
						const categoryId = this.getNodeParameter('categoryId', i) as string;

						const response = await zohoExpenseApiRequest.call(
							this,
							'GET',
							`/expensecategories/${categoryId}`,
							{},
							{},
						);

						responseData = (response.expense_category as IDataObject) ?? response;
					}

					// ----------------------------------
					//         category:getAll
					// ----------------------------------
					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;

						const qs: IDataObject = {};
						Object.assign(qs, filters);

						if (returnAll) {
							responseData = await zohoExpenseApiRequestAllItems.call(
								this,
								'GET',
								'/expensecategories',
								{},
								qs,
								'expense_categories',
							);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.per_page = limit;
							qs.page = 1;

							const response = await zohoExpenseApiRequest.call(
								this,
								'GET',
								'/expensecategories',
								{},
								qs,
							);

							responseData = response.expense_categories as IDataObject[];
						}
					}
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData),
					{ itemData: { item: i } },
				);

				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({ error: (error as Error).message }),
						{ itemData: { item: i } },
					);
					returnData.push(...executionData);
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
