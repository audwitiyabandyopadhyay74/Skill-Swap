import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

// Transporter configuration (Zoho SMTP server: smtp.zoho.in, Port: 465, Mode: SSL)
const createTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.zoho.in';
  const port = Number(process.env.SMTP_PORT) || 465;
  const secure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : true;
  const user = process.env.SMTP_USER || 'audwitiyabandyopadhyay74@zohomail.in';
  const pass = process.env.SMTP_PASS || '';

  if (user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure, // true for port 465 SSL
      auth: {
        user,
        pass
      }
    });
  }

  // Fallback transporter logging if SMTP_PASS app password is not configured yet
  return nodemailer.createTransport({
    jsonTransport: true
  });
};


// @route   POST /api/contact
// @desc    Submit contact form and deliver email
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, email, category, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required fields.' });
    }

    const targetEmail = 'audwitiyabandyopadhyay74@zohomail.in';
    const mailSubject = `[SkillSwap Contact: ${category || 'General'}] ${subject || 'New Message from ' + name}`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; background-color: #07070b; color: #ffffff; padding: 30px; borderRadius: 16px;">
        <h2 style="color: #00ff62; margin-bottom: 20px;">SkillSwap New Contact Form Message</h2>
        <table style="width: 100%; border-collapse: collapse; color: #ffffff;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; width: 120px; color: #a1a1aa;">Sender Name:</td>
            <td style="padding: 8px 0;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #a1a1aa;">Sender Email:</td>
            <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #00ff62;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #a1a1aa;">Category:</td>
            <td style="padding: 8px 0;">${category || 'General Inquiry'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #a1a1aa;">Subject:</td>
            <td style="padding: 8px 0;">${subject || 'N/A'}</td>
          </tr>
        </table>
        <div style="margin-top: 20px; padding: 20px; background-color: rgba(255,255,255,0.05); border-left: 4px solid #00ff62; border-radius: 8px;">
          <h3 style="margin-top: 0; color: #ffffff;">Message Content:</h3>
          <p style="white-space: pre-wrap; color: #e4e4e7; line-height: 1.6;">${message}</p>
        </div>
        <p style="margin-top: 25px; font-size: 12px; color: #71717a;">Delivered via SkillSwap Contact Dispatcher to ${targetEmail}</p>
      </div>
    `;

    const transporter = createTransporter();

    const mailOptions = {
      from: `"SkillSwap Contact Form" <noreply@skillswap.io>`,
      replyTo: email,
      to: targetEmail,
      subject: mailSubject,
      text: `Name: ${name}\nEmail: ${email}\nCategory: ${category}\nSubject: ${subject}\n\nMessage:\n${message}`,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️ Contact message from ${email} sent to ${targetEmail}:`, info.messageId || 'Queued');

    return res.status(200).json({
      success: true,
      message: `Message sent successfully to ${targetEmail}`,
      targetEmail
    });
  } catch (err) {
    console.error('Failed to deliver contact email:', err);
    return res.status(500).json({
      message: 'Failed to process contact email delivery.',
      error: err.message
    });
  }
});

export default router;
