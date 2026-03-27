import { Context } from "hono";
import nodemailer from "nodemailer";
import { buildContactEmail } from "../../lib/email/contact-template";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

export const contactController = {
    send: async (c: Context) => {
        const { name, email, subject, message } = await c.req.json();

        try {
            await transporter.sendMail({
                from: `"Suporte Anti-Tédio" <${process.env.GMAIL_USER}>`,
                to: process.env.CONTACT_RECEIVER ?? process.env.GMAIL_USER,
                replyTo: `${name} <${email}>`,
                subject: `[SUPORTE] ${subject}`,
                html: buildContactEmail(name, email, subject, message),
            });

            return c.json({ ok: true, message: 'Mensagem enviada com sucesso!' }, 201);
        } catch (error) {
            console.error('[Contact Error]:', error);
            return c.json({ ok: false, message: 'Erro interno ao enviar e-mail' }, 500);
        }
    }
};