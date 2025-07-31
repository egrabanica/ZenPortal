# Email Configuration Guide

This guide will help you set up email functionality for the fact-check requests in your ZenNews application.

## Quick Setup (Gmail - Recommended)

### Step 1: Prepare Gmail Account

1. **Use an existing Gmail account** or create a new one specifically for sending emails
2. **Enable 2-Factor Authentication**:
   - Go to [Google Account Settings](https://myaccount.google.com/)
   - Click "Security" → "2-Step Verification"
   - Follow the setup process

### Step 2: Generate App Password

1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. You might need to sign in again
3. Select "Mail" and your device type
4. Click "Generate"
5. Copy the 16-character password (it looks like: `abcd efgh ijkl mnop`)

### Step 3: Update .env.local

Replace the placeholders in your `.env.local` file:

```env
# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your-actual-gmail@gmail.com
EMAIL_PASSWORD=your-16-character-app-password
```

**Example:**
```env
EMAIL_SERVICE=gmail
EMAIL_USER=creativecode2@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
```

### Step 4: Test the Configuration

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Go to the fact-check page: `http://localhost:3000/fact-check`
3. Submit a test request
4. Check the console for success messages
5. Check `info@zennews.net` inbox for the email

## Alternative Options

### Option 2: Outlook/Hotmail

If you prefer using Outlook/Hotmail:

```env
EMAIL_SERVICE=outlook
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
```

### Option 3: Custom SMTP Server

For other email providers:

```env
EMAIL_SERVICE=custom
EMAIL_USER=your-email@yourdomain.com
EMAIL_PASSWORD=your-password
SMTP_HOST=smtp.yourdomain.com
SMTP_PORT=587
SMTP_SECURE=false
```

## Troubleshooting

### Common Issues:

1. **"Authentication failed"**
   - Make sure you're using an App Password, not your regular Gmail password
   - Verify 2FA is enabled on your Gmail account

2. **"Less secure app access"**
   - Google no longer supports this - you MUST use App Passwords

3. **Emails not being sent**
   - Check the console for error messages
   - Verify your credentials are correct
   - Make sure there are no extra spaces in the password

4. **Development vs Production**
   - The current setup works for both
   - For production, consider using a dedicated email service like SendGrid or AWS SES

### Testing

If you want to test without setting up email, the system will:
- Log all email details to the console
- Still show success messages to users
- Allow you to see what would be sent

## Security Notes

- Never commit your `.env.local` file to version control
- Use App Passwords instead of regular passwords
- Consider using a dedicated email account for your application
- For production, consider using professional email services

## Need Help?

If you encounter issues:
1. Check the browser console for error messages
2. Check the terminal/console where you're running the development server
3. Verify your Gmail App Password is correct
4. Make sure 2FA is enabled on your Gmail account
