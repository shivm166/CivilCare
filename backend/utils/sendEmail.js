// utils/sendEmail.js
import nodemailer from "nodemailer";

// ✅ Create transporter (Gmail or custom SMTP)
const createTransporter = () => {
  // Default: Gmail setup (for dev/testing)
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.EMAIL_PASSWORD, // Your Gmail App Password
    },
  });

  /*
  // 🟢 Optional: Use this for custom SMTP (production servers)
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST, // e.g., smtp.gmail.com or smtp.yourdomain.com
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  */
};

// ✅ Send Society Invitation Email
export const sendInvitationEmail = async ({
  to,
  name,
  invitationLink,
  societyName,
}) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: {
        name: "CivilCare Society Management",
        address: process.env.EMAIL_USER,
      },
      to,
      subject: `You're invited to join ${societyName}!`,
      html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            padding: 20px;
            color: #333;
          }
          .container {
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            padding: 30px;
            max-width: 600px;
            margin: 20px auto;
          }
          .button {
            background: linear-gradient(135deg, #4f46e5, #7c3aed);
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            display: inline-block;
            margin-top: 15px;
          }
          .footer {
            text-align: center;
            font-size: 12px;
            color: #666;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Welcome to ${societyName}, ${name}!</h2>
          <p>You have been invited to join <b>${societyName}</b> on the CivilCare platform.</p>
          <p>Click the button below to activate your account:</p>
          <a href="${invitationLink}" class="button">Activate Account</a>
          <p style="margin-top:20px; font-size:13px;">
            Or copy and paste this link into your browser:<br>
            <a href="${invitationLink}">${invitationLink}</a>
          </p>
          <p style="font-size:13px; color:#555;">This invitation link will expire in 7 days.</p>
          <div class="footer">
            <p>This email was sent by CivilCare Society Management System</p>
            <p>If you didn’t expect this invitation, you can safely ignore it.</p>
          </div>
        </div>
      </body>
      </html>
      `,
      text: `
Hi ${name},

You've been invited to join ${societyName} on CivilCare.

To activate your account, visit:
${invitationLink}

This link expires in 7 days.

If you didn’t request this, ignore this email.

— CivilCare Team
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Invitation Email Sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error sending invitation email:", error.message);
    throw new Error("Failed to send invitation email");
  }
};

// ✅ Send Password Reset Email
export const sendPasswordResetEmail = async ({ to, name, resetLink }) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: {
        name: "CivilCare Society Management",
        address: process.env.EMAIL_USER,
      },
      to,
      subject: "Reset Your Password - CivilCare",
      html: `
      <html>
        <body style="font-family: Arial, sans-serif; max-width:600px; margin:auto;">
          <h2>Password Reset Request</h2>
          <p>Hi ${name},</p>
          <p>We received a request to reset your password. Click below to set a new password:</p>
          <a href="${resetLink}" 
             style="background-color:#e11d48;color:#fff;padding:10px 20px;
             border-radius:5px;text-decoration:none;">Reset Password</a>
          <p>If you did not request a password reset, please ignore this email.</p>
          <p>This link expires in 1 hour.</p>
        </body>
      </html>
      `,
      text: `
Hi ${name},

We received a password reset request.

To reset your password, click:
${resetLink}

If you didn't request this, ignore this email.

— CivilCare Team
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Password reset email sent:", info.messageId);
    return { success: true };
  } catch (error) {
    console.error("❌ Error sending reset email:", error.message);
    throw new Error("Failed to send password reset email");
  }
};

// ✅ Test Email Configuration
export const testEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log("✅ Email configuration verified successfully!");
    return true;
  } catch (error) {
    console.error("❌ Email configuration failed:", error.message);
    return false;
  }
};
