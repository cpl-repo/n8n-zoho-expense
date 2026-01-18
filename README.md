# n8n-nodes-zoho-expense-by-datingscout

This is an n8n community node that provides full integration with the [Zoho Expense API](https://www.zoho.com/expense/api/v1/).

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

```bash
npm install n8n-nodes-zoho-expense-by-datingscout
```

Or using pnpm:

```bash
pnpm install n8n-nodes-zoho-expense-by-datingscout
```

## Resources & Operations

### Expense

| Operation | Description |
|-----------|-------------|
| **Create** | Create a new expense with line items, attendees, custom fields, and more |
| **Delete** | Delete an expense |
| **Get** | Get a single expense by ID |
| **Get Many** | List all expenses with comprehensive filtering options |
| **Merge** | Merge multiple expenses into one |
| **Update** | Update an existing expense's details |

### Expense Report

| Operation | Description |
|-----------|-------------|
| **Approve** | Approve an expense report |
| **Create** | Create a new expense report |
| **Delete** | Delete an expense report |
| **Get** | Get a single expense report by ID |
| **Get Many** | List all expense reports with filtering options |
| **Recall** | Recall a submitted expense report |
| **Reject** | Reject an expense report |
| **Submit** | Submit an expense report for approval |
| **Update** | Update an existing expense report |

### Trip

| Operation | Description |
|-----------|-------------|
| **Create** | Create a new trip |
| **Delete** | Delete a trip |
| **Get** | Get a single trip by ID |
| **Get Many** | List all trips |
| **Update** | Update an existing trip |

### User

| Operation | Description |
|-----------|-------------|
| **Get** | Get a single user by ID |
| **Get Many** | List all users with filtering options |

### Category

| Operation | Description |
|-----------|-------------|
| **Get** | Get a single expense category by ID |
| **Get Many** | List all expense categories |

## Credentials

To use this node, you need to set up OAuth2 credentials for Zoho Expense:

1. Go to the [Zoho API Console](https://api-console.zoho.com/)
2. Create a new client (Server-based Application)
3. Set the redirect URL to your n8n OAuth callback URL (e.g., `https://your-n8n-instance.com/rest/oauth2-credential/callback`)
4. Note down the Client ID and Client Secret
5. In n8n, create new credentials of type "Zoho Expense OAuth2 API"
6. Enter your Client ID and Client Secret
7. Select your Zoho data center (US, EU, India, Australia, Japan, China, or Canada)
8. Connect and authorize

### Required Scopes

The following OAuth scopes are requested:
- `ZohoExpense.fullaccess.all` - Full access to Zoho Expense

## Features

### Expense Operations

**Create Expense**
- Set currency and date
- Add multiple line items with categories, amounts, taxes, and tags
- Associate with merchants, customers, and projects
- Add attendees and custom fields
- Configure billable and reimbursable flags
- Set payment mode and paid-through account

**Get Many Expenses**
- Filter by status (draft, submitted, approved, reimbursed, etc.)
- Filter by date range
- Filter by user, category, merchant, customer, or project
- Pagination support with "Return All" option

**Update Expense**
- Update any expense field
- Modify line items (add, update, or replace)
- Update attendees and custom fields
- Change associated merchant, customer, or project

**Merge Expenses**
- Merge duplicate expenses into a single expense
- Specify primary and duplicate expense IDs

### Expense Report Operations

**Create/Update Reports**
- Set report name and description
- Define report period with start and end dates
- Associate with trips

**Workflow Actions**
- Submit reports for approval
- Approve or reject reports with comments
- Recall submitted reports

### Trip Operations

**Create/Update Trips**
- Set trip name, destination, and description
- Define trip dates
- Set budget

### User Operations

**Get Users**
- Filter by role (admin, approver, submitter)
- Filter by status (active, inactive)

### Category Operations

**Get Categories**
- Filter by enabled status

## Supported Data Centers

- zoho.com (US)
- zoho.eu (Europe)
- zoho.in (India)
- zoho.com.au (Australia)
- zoho.jp (Japan)
- zoho.com.cn (China)
- zohocloud.ca (Canada)

## Dynamic Options

The node provides dynamic loading for:
- Organizations
- Currencies
- Expense Categories
- Taxes
- Merchants
- Customers
- Projects
- Users
- Accounts
- Expense Reports
- Trips

## Compatibility

- Requires n8n version 1.0.0 or later
- Node.js 18.10 or later

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
* [Zoho Expense API Documentation](https://www.zoho.com/expense/api/v1/)

## License

[MIT](LICENSE)

## Author

DatingScout - [dev@datingscout.com](mailto:dev@datingscout.com)
