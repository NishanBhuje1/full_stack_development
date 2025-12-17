import { Resend } from "resend";
import { env } from "./env.js";

let resend = null;

function getResend() {
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY);
  return resend;
}

export async function sendLeadEmail({ lead }) {
  // lead: the row you saved in DB
  const subject = `[FixMate] New Lead: ${lead.type} - ${lead.model} (${lead.issue})`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2>New Lead Received</h2>
      <p><strong>Type:</strong> ${lead.type}</p>
      <p><strong>Name:</strong> ${lead.fullName}</p>
      <p><strong>Email:</strong> ${lead.email || "-"}</p>
      <p><strong>Phone:</strong> ${lead.phone}</p>
      <p><strong>Device:</strong> ${(lead.brand ? lead.brand + " " : "") + (lead.model || "-")}</p>
      <p><strong>Issue:</strong> ${lead.issue}</p>
      <p><strong>Estimate:</strong> ${
        lead.estimateLow != null && lead.estimateHigh != null
          ? `$${lead.estimateLow} – $${lead.estimateHigh}`
          : "-"
      }</p>
      <p><strong>Preferred Date:</strong> ${lead.preferredDate ? new Date(lead.preferredDate).toLocaleDateString() : "-"}</p>
      <p><strong>Preferred Time:</strong> ${lead.preferredTime || "-"}</p>
      <p><strong>Message:</strong><br/>${(lead.message || "-").replaceAll("\n", "<br/>")}</p>
      <hr/>
      <p style="color: #666;">Sent automatically from FixMate website.</p>
    </div>
  `;

  const client = getResend();

  await client.emails.send({
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
    subject,
    html,
  });
}
