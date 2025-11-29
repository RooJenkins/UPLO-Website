import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Send email to hello@uplo.ai
    const { data, error } = await resend.emails.send({
      from: 'UPLO Contact Form <onboarding@resend.dev>',
      to: ['hello@uplo.ai'],
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          <div style="margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          </div>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #555;">Message:</h3>
            <p style="white-space: pre-wrap; color: #333;">${message}</p>
          </div>
          <p style="color: #888; font-size: 12px; margin-top: 30px;">
            This email was sent from the UPLO website contact form.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ error: 'Failed to send email' });
    }

    // Send confirmation copy to the user
    await resend.emails.send({
      from: 'UPLO <onboarding@resend.dev>',
      to: [email],
      subject: `Your message to UPLO - Confirmation`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px;">
            Thanks for reaching out!
          </h2>
          <p style="color: #555; font-size: 16px;">
            Hi ${name}, we've received your message and will get back to you soon.
          </p>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #555;">Your message:</h3>
            <p style="white-space: pre-wrap; color: #333;">${message}</p>
          </div>
          <p style="color: #888; font-size: 14px; margin-top: 30px;">
            Best regards,<br/>
            <strong>The UPLO Team</strong>
          </p>
          <p style="color: #aaa; font-size: 12px; margin-top: 20px;">
            This is an automated confirmation. Please don't reply to this email.
          </p>
        </div>
      `,
    });

    return res.status(200).json({ success: true, id: data?.id });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
