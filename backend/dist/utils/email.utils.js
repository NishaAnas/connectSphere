import nodemailer from 'nodemailer';
import config from '../config/env.config.js';
const transporter = nodemailer.createTransport({
    service: config.emailService,
    auth: {
        user: config.emailUser,
        pass: config.emailPassword,
    },
});
export const sendEmail = async (to, subject, text) => {
    try {
        await transporter.sendMail({
            from: config.emailUser,
            to,
            subject,
            text,
        });
    }
    catch (error) {
        throw new Error('Failed to send email.');
    }
};
//# sourceMappingURL=email.utils.js.map