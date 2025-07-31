import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Create transporter for sending emails
const createTransporter = () => {
  // You can use different email services here:
  // 1. Gmail
  // 2. Outlook/Hotmail
  // 3. Yahoo
  // 4. Custom SMTP server
  
  // Example for Gmail (you'll need to enable 2FA and use App Password)
  if (process.env.EMAIL_SERVICE === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD // App password, not regular password
      }
    });
  }
  
  // Example for Outlook/Hotmail
  if (process.env.EMAIL_SERVICE === 'outlook') {
    return nodemailer.createTransport({
      host: 'smtp-mail.outlook.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      },
      tls: {
        ciphers: 'SSLv3'
      }
    });
  }
  
  // Generic SMTP configuration
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, subject, text, isFactCheck } = body;

    // If it's a fact-check request, use the environment variable for recipient
    const recipientEmail = isFactCheck ? process.env.FACT_CHECK_EMAIL || 'info@zennews.net' : to;

    if (!recipientEmail || !subject || !text) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if email configuration is available
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.warn('Email configuration missing. Email will only be logged.');
      console.log('Email to be sent:', {
        to,
        subject,
        text,
        timestamp: new Date().toISOString()
      });
      
      return NextResponse.json({ 
        success: true, 
        message: 'Email logged (no email service configured)' 
      });
    }

    try {
      const transporter = createTransporter();
      
      // Send email
      const info = await transporter.sendMail({
        from: process.env.EMAIL_USER, // sender address
        to: recipientEmail, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
        html: `<pre>${text}</pre>` // html body (formatted as preformatted text)
      });

      console.log('Email sent successfully:', info.messageId);
      
      return NextResponse.json({ 
        success: true, 
        message: 'Email sent successfully',
        messageId: info.messageId
      });
      
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      
      // Log the email data as fallback
      console.log('Email to be sent (email service failed):', {
        to,
        subject,
        text,
        timestamp: new Date().toISOString()
      });
      
      return NextResponse.json({ 
        success: true, 
        message: 'Email logged (email service unavailable)' 
      });
    }

  } catch (error) {
    console.error('Error processing email request:', error);
    return NextResponse.json({ error: 'Failed to process email request' }, { status: 500 });
  }
}
