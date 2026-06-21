import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
}) {
  const result = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to,
    subject,
    html,
    text,
  });

  if (result.error) {
    console.error("❌ Resend failed:", result.error);
    throw new Error(result.error.message || "Failed to send email");
  }

  // console.log("----------- ✅ Email sent to:", to, "ID:", result.data?.id);
  return result;
}
