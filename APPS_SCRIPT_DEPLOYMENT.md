# Google Apps Script Deployment Guide

This guide explains how to deploy the Apps Script authentication system for HBZxLRG.

## Prerequisites

1. Google Account with Google Drive access
2. A Google Sheet for storing user data
3. A Google Apps Script project

## Step 1: Create Google Sheet

1. Go to [Google Sheet](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it `Users`
4. Delete all default sheets except the first one
5. Rename the first sheet to `Users`
6. Add column headers in row 1:
   - **A:** ID
   - **B:** Username
   - **C:** Email
   - **D:** Password_Hash
   - **E:** Created_At
   - **F:** Updated_At
   - **G:** Is_Banned
   - **H:** Auth_Token
   - **I:** Token_Expiry
   - **J:** Reset_Token
   - **K:** Reset_Token_Expiry

7. Copy the Sheet ID from the URL: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit`

## Step 2: Create Apps Script Project

1. Go to [Google Apps Script](https://script.google.com)
2. Click "New project"
3. Rename the project to "HBZxLRG Auth"
4. Delete the default `Code.gs` file
5. Copy all code from `APPS_SCRIPT_CODE.gs` file in this project
6. Paste it into a new file called `Code.gs`

## Step 3: Configure Apps Script

In the `Code.gs` file, update these configuration values (lines 7-9):

```javascript
const SHEET_ID = "YOUR_GOOGLE_SHEET_ID";          // From Step 1
const JWT_SECRET = "your-secret-key-here";        // Change to a strong secret
const ADMIN_PASSWORD = "admin@123";                // Change to a strong password
```

### Configuration Details:

- **SHEET_ID**: Your Google Sheet ID (found in the URL)
- **JWT_SECRET**: A secret key for JWT token generation. Make it long and random:
  ```
  Example: "kK7#mP9$xL2@qW5&vZ8*jY3^hN4!bC6"
  ```
- **ADMIN_PASSWORD**: Password for admin panel access. Change from default!

## Step 4: Deploy Web App

1. In Apps Script editor, click **Deploy** → **New deployment**
2. Select **Type**: Web app
3. Set **Execute as**: Your Google Account
4. Set **Who has access**: Anyone
5. Click **Deploy**
6. Copy the deployment URL (format: `https://script.google.com/macros/d/{SCRIPT_ID}/userweb`)

## Step 5: Configure Frontend

1. Open `config.js` in your project
2. Update line 3 with your Apps Script web app URL:

```javascript
const APPS_SCRIPT_URL = "https://script.google.com/macros/d/{SCRIPT_ID}/userweb";
```

Replace `{SCRIPT_ID}` with the ID from your deployment URL.

## Step 6: Test the System

1. Open `index.html` in a web browser
2. Test signup with new account
3. Test login with created account
4. Verify data is saved in Google Sheet

### Test Admin Panel

1. Go to `admin.html`
2. When prompted for admin password, enter the password you set in Step 3
3. You should see all users in the database
4. Test CRUD operations:
   - View users
   - Edit user details
   - Ban/Unban users
   - Delete users
   - Issue new tokens

## Troubleshooting

### Problem: "CORS error" or "Network error"

**Solution**: Verify that:
1. Apps Script deployment URL is correct in `config.js`
2. Apps Script is deployed as "Web app" with "Anyone" access
3. Apps Script project has authorization enabled

### Problem: "Can't find sheet" error

**Solution**:
1. Verify your Google Sheet name is exactly `"Users"`
2. Verify SHEET_ID is correct in Apps Script Code.gs
3. Ensure the Google Account used for Apps Script has access to the Sheet

### Problem: Login fails but signup works

**Solution**:
1. Check that password hashing is working (verify `bcryptjs` library)
2. Verify JWT_SECRET is the same on all deployments
3. Check browser console for detailed error messages

### Problem: Email notifications not working

**Solution**:
1. Enable Gmail API in Google Cloud Console
2. Verify email address is correct
3. Check Apps Script execution logs for errors

## Security Recommendations

1. **Change default admin password** in `Code.gs` line 9
2. **Use strong JWT_SECRET** - at least 32 characters
3. **Restrict Sheet access** - only share with trusted users
4. **Enable 2FA** on Google Account
5. **Rotate tokens periodically** - update JWT_SECRET every 3-6 months
6. **Monitor Sheet changes** - check for unauthorized modifications
7. **Use HTTPS** when deploying frontend (not HTTP)

## API Endpoints

All endpoints are handled by the single Apps Script web app URL with different `action` parameters:

```
POST {APPS_SCRIPT_URL}
{
  "action": "signup|login|forgotPassword|resetPassword|changePassword|...",
  "data": { /* endpoint-specific data */ }
}
```

See `config.js` for all available API functions and their parameters.

## Updating Code

To update the Apps Script code:

1. Make changes in `Code.gs` in Apps Script editor
2. Click **Deploy** → **Manage deployments**
3. Select the deployment → **Edit**
4. Update the code → **Deploy**
5. Click **Replace deployment**

## Support

For issues with:
- **Frontend**: Check browser console (F12)
- **Backend**: Check Apps Script execution logs (Execution tab)
- **Database**: Check Google Sheet directly for data

---

**Last Updated**: 2024
**Version**: 1.0
