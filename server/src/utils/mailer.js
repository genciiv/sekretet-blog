import nodemailer from "nodemailer";

export function makeTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || "587");
  const secure = String(process.env.SMTP_SECURE || "false") === "true";
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error("SMTP config missing (SMTP_HOST/SMTP_USER/SMTP_PASS)");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

export async function sendVerifyEmail({ to, verifyUrl }) {
  const from = process.env.MAIL_FROM || process.env.SMTP_USER;

  const transport = makeTransport();
  await transport.sendMail({
    from,
    to,
    subject: "Verifiko email-in për komentin",
    text: `Për të verifikuar email-in dhe komentin, kliko linkun: ${verifyUrl}`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.5">
        <h2>Verifikim email</h2>
        <p>Faleminderit për komentin. Për ta verifikuar email-in, kliko:</p>
        <p><a href="${verifyUrl}">${verifyUrl}</a></p>
        <p>Nëse s’e ke bërë ti, thjesht injoroje këtë email.</p>
      </div>
    `,
  });
}
