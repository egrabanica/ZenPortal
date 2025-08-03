import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    const { title, url, description, mediaInfo } = formData;

    // Validate required fields
    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    // Create email content
    const emailContent = `
New Fact Check Submission

Title/Claim: ${title}
Source URL: ${url || 'Not provided'}
Description: ${description}
${mediaInfo || 'No media attached'}

Submitted on: ${new Date().toLocaleString()}
    `.trim();

    // Email configuration using environment variables
    const emailConfig = {
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    };

    // If no email configuration, just log and return success (for development)
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.log('=== FACT CHECK SUBMISSION (Email not configured) ===');
      console.log(emailContent);
      console.log('=== END SUBMISSION ===');
      
      return NextResponse.json({
        success: true,
        message: 'Submission logged successfully (email configuration pending)'
      });
    }

    // Create transporter
    const transporter = nodemailer.createTransporter(emailConfig);

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.FACT_CHECK_EMAIL || 'info@zennews.net',
      subject: `Fact Check Submission: ${title}`,
      text: emailContent,
      html: emailContent.replace(/\n/g, '<br>')
    });

    return NextResponse.json({
      success: true,
      message: 'Fact check submission sent successfully'
    });

  } catch (error) {
    console.error('Fact check submission error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send submission',
        details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      },
      { status: 500 }
    );
  }
}
