import { sendEmail } from "./send-email";

export async function sendPasswordResetEmail({
  user,
  url,
}: {
  user: { email: string; name: string };
  url: string;
}) {
  return sendEmail({
    to: user.email,
    subject: "Reset your password",
    html: `
      <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto;">
        <h2 style="color: #333;">Reset Your Password</h2>
        <p>Hello ${user.name},</p>
        <p>You requested to reset your password. Click the button below:</p>
        <a href="${url}" 
           style="display: inline-block; padding: 12px 24px; background: #0d0d0d; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">
          Reset Password
        </a>
        <p style="color: #888; font-size: 12px;">
          If you didn't request this, you can ignore this email.
        </p>
      </div>
    `,
    text: `Hello ${user.name},\n\nYou requested to reset your password. Click this link: ${url}\n\nIf you didn't request this, ignore this email.`,
  });
}
