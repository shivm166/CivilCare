import nodemailer from "nodemailer";

// Create reusable transporter
const createTransporter = () => {
  // For Gmail (Recommended for development/testing)
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.EMAIL_PASSWORD, // Your Gmail App Password
    },
  });

  // Alternative: For other email services (Outlook, Yahoo, etc.)
  // return nodemailer.createTransport({
  //   host: process.env.EMAIL_HOST, // e.g., smtp.gmail.com
  //   port: process.env.EMAIL_PORT, // 587 for TLS, 465 for SSL
  //   secure: false, // true for 465, false for other ports
  //   auth: {
  //     user: process.env.EMAIL_USER,
  //     pass: process.env.EMAIL_PASSWORD,
  //   },
  // });
};

// Send invitation email
export const sendInvitationEmail = async ({ to, name, invitationLink, societyName }) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: {
        name: "CivilCare Society Management",
        address: process.env.EMAIL_USER,
      },
      to: to,
      subject: `You're invited to join ${societyName}!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              padding: 40px 20px;
              border-radius: 10px;
              text-align: center;
            }
            .content {
              background: white;
              padding: 30px;
              border-radius: 8px;
              margin-top: 20px;
            }
            .button {
              display: inline-block;
              padding: 15px 30px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
              font-weight: bold;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 12px;
              color: #666;
            }
            h1 {
              color: white;
              margin: 0;
            }
            .icon {
              font-size: 48px;
              margin-bottom: 10px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon">🏘️</div>
            <h1>Welcome to ${societyName}!</h1>
          </div>
          
          <div class="content">
            <h2>Hi ${name}! 👋</h2>
            
            <p>Great news! You've been invited to join <strong>${societyName}</strong> on CivilCare.</p>
            
            <p>CivilCare is a modern society management platform that helps you:</p>
            <ul style="text-align: left; display: inline-block;">
              <li>Stay connected with your community</li>
              <li>Receive important announcements</li>
              <li>Raise and track complaints</li>
              <li>Manage society activities</li>
            </ul>
            
            <p><strong>To get started, please activate your account:</strong></p>
            
            <a href="${invitationLink}" class="button">Activate Your Account</a>
            
            <p style="font-size: 12px; color: #666; margin-top: 20px;">
              Or copy and paste this link in your browser:<br>
              <span style="word-break: break-all;">${invitationLink}</span>
            </p>
            
            <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666;">
              This invitation link will expire in <strong>7 days</strong>.
            </p>
          </div>
          
          <div class="footer">
            <p>This email was sent by CivilCare Society Management System</p>
            <p>If you didn't expect this invitation, you can safely ignore this email.</p>
          </div>
        </body>
        </html>
      `,
      // Plain text fallback
      text: `
Hi ${name}!

You've been invited to join ${societyName} on CivilCare.

To activate your account, please visit:
${invitationLink}

This link will expire in 7 days.

If you didn't expect this invitation, you can safely ignore this email.

---
CivilCare Society Management System
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log("✅ Email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

// Send password reset email (optional - for future use)
export const sendPasswordResetEmail = async ({ to, name, resetLink }) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: {
        name: "CivilCare Society Management",
        address: process.env.EMAIL_USER,
      },
      to: to,
      subject: "Reset Your Password - CivilCare",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background: #f44336;
              padding: 40px 20px;
              border-radius: 10px;
              text-align: center;
            }
            .content {
              background: white;
              padding: 30px;
              border-radius: 8px;
              margin-top: 20px;
            }
            .button {
              display: inline-block;
              padding: 15px 30px;
              background: #f44336;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
              font-weight: bold;
            }
            h1 {
              color: white;
              margin: 0;
            }
            .icon {
              font-size: 48px;
              margin-bottom: 10px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon">🔒</div>
            <h1>Password Reset Request</h1>
          </div>
          
          <div class="content">
            <h2>Hi ${name},</h2>
            
            <p>We received a request to reset your password.</p>
            
            <p>Click the button below to create a new password:</p>
            
            <a href="${resetLink}" class="button">Reset Password</a>
            
            <p style="font-size: 12px; color: #666; margin-top: 20px;">
              Or copy and paste this link in your browser:<br>
              <span style="word-break: break-all;">${resetLink}</span>
            </p>
            
            <p style="margin-top: 30px; color: #f44336; font-weight: bold;">
              ⚠️ This link will expire in 1 hour.
            </p>
            
            <p style="margin-top: 20px; font-size: 14px; color: #666;">
              If you didn't request a password reset, please ignore this email or contact support if you have concerns.
            </p>
          </div>
        </body>
        </html>
      `,
      text: `
Hi ${name},

We received a request to reset your password.

To reset your password, please visit:
${resetLink}

This link will expire in 1 hour.

If you didn't request a password reset, please ignore this email.

---
CivilCare Society Management System
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log("✅ Password reset email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error sending password reset email:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

// Test email configuration
export const testEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log("✅ Email configuration is correct!");
    return true;
  } catch (error) {
    console.error("❌ Email configuration error:", error);
    return false;
  }
};
