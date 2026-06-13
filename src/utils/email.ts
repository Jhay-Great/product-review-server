import nodemailer from 'nodemailer';

interface SendResult {
    messageId?: string;
    previewUrl?: string | false;
}

export async function sendResetPasswordEmail(to: string, resetUrl: string): Promise<SendResult> {
    // Prefer SMTP settings from env; fall back to Ethereal test account for dev
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : undefined;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    let transporter;
    let previewUrl: string | false = false;

    if (host && user && pass) {
        transporter = nodemailer.createTransport({
            host,
            port: port || 587,
            secure: false,
            auth: { user, pass },
        });
    } else {
        // create Ethereal test account
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
    }

    const from = process.env.EMAIL_FROM || 'no-reply@example.com';

    const info = await transporter.sendMail({
        from,
        to,
        subject: 'Password reset request',
        text: `You requested a password reset. Use this link: ${resetUrl}`,
        html: `<p>You requested a password reset.</p><p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
    });

    try {
        previewUrl = nodemailer.getTestMessageUrl(info) || false;
    } catch (_e) {
        previewUrl = false;
    }

    return { messageId: info.messageId, previewUrl };
}
