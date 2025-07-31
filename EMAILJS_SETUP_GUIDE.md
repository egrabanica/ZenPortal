# EmailJS Setup Guide - Easy Email Alternative

EmailJS allows you to send emails directly from your website without server-side email configuration. Perfect for fact-check submissions!

## Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click "Sign Up" and create a free account
3. Verify your email address

## Step 2: Set Up Email Service

1. **Go to "Email Services"** in your EmailJS dashboard
2. **Click "Add New Service"**
3. **Choose your email provider:**
   - **Gmail** (Recommended)
   - **Outlook/Hotmail**
   - **Yahoo**
   - Or any other provider

4. **For Gmail:**
   - Click "Gmail"
   - Connect your Gmail account
   - Allow EmailJS permissions

5. **Copy the Service ID** (looks like: `service_abc123`)

## Step 3: Create Email Template

1. **Go to "Email Templates"** in your dashboard
2. **Click "Create New Template"**
3. **Template Configuration:**
   ```
   To Email: info@zennews.net
   From Name: ZenNews Fact Check
   Subject: {{subject}}
   
   Template Content:
   New Fact Check Submission
   
   Title: {{title}}
   URL: {{url}}
   Description: {{description}}
   Media Info: {{media_info}}
   
   Submitted on: {{timestamp}}
   ```

4. **Copy the Template ID** (looks like: `template_abc123`)

## Step 4: Get Public Key

1. **Go to "Account"** in your dashboard
2. **Find "Public Key"** section
3. **Copy the Public Key** (looks like: `abc123xyz`)

## Step 5: Update Your Environment Variables

Replace the values in your `.env.local` file:

```env
# EmailJS Configuration
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_abc123
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_abc123
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=abc123xyz
```

## Step 6: Test the Setup

1. **Restart your development server:**
   ```bash
   npm run dev
   ```

2. **Visit the fact-check page:**
   ```
   http://localhost:3000/fact-check
   ```

3. **Submit a test request**

4. **Check `info@zennews.net` for the email**

## Benefits of EmailJS:

✅ **No server configuration needed**
✅ **No SMTP credentials required**
✅ **Works immediately after setup**
✅ **Free tier available (200 emails/month)**
✅ **Direct browser-to-email delivery**

## Template Variables Available:

- `{{to_email}}` - Recipient email
- `{{subject}}` - Email subject
- `{{title}}` - Fact check title
- `{{url}}` - Source URL
- `{{description}}` - Description
- `{{media_info}}` - Media information
- `{{timestamp}}` - Submission time

## Troubleshooting:

1. **"Service not found"** - Check your Service ID
2. **"Template not found"** - Check your Template ID
3. **"Unauthorized"** - Check your Public Key
4. **Emails not arriving** - Check spam folder, verify template setup

## Free Tier Limits:

- 200 emails per month
- 2 email services
- 2 email templates
- Perfect for fact-check submissions!

For higher volumes, upgrade to a paid plan on EmailJS.
