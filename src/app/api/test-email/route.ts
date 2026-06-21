import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function GET() {
  try {
    const result = await resend.emails.send({
      from: "EnvBox <hello@envbox.omidbagheri.com>",
      to: "sezar.b193@gmail.com", 
      subject: "Test from EnvBox",
      html: "<p>If you see this, Resend works!</p>",
    });

    return Response.json({ success: true, result });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown" },
      { status: 500 },
    );
  }
}
