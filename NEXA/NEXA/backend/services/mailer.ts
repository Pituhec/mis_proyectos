import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

export async function enviarEmail(opts: { to: string; subject: string; html: string }) {
  await transporter.sendMail({ from: process.env.SMTP_FROM || "NEXA <noreply@nexa.app>", ...opts });
}

export async function enviarAlertaPanico(opts: {
  to: string; nombreMayor: string; lat?: number; lng?: number;
}) {
  const mapaUrl = opts.lat && opts.lng ? `https://maps.google.com/?q=${opts.lat},${opts.lng}` : null;
  await enviarEmail({
    to: opts.to,
    subject: `⚠️ NEXA — ${opts.nombreMayor} ha pulsado el botón de pánico`,
    html: `
      <div style="font-family:sans-serif;max-width:480px">
        <h2 style="color:#e53e3e">⚠️ Alerta de pánico</h2>
        <p><strong>${opts.nombreMayor}</strong> ha pulsado el botón de pánico en su pulsera NEXA.</p>
        ${mapaUrl ? `<p><a href="${mapaUrl}" style="color:#4f6ef7">Ver ubicación en Google Maps →</a></p>` : ""}
        <p style="color:#718096;font-size:13px">Mensaje automático de NEXA.</p>
      </div>
    `,
  });
}
