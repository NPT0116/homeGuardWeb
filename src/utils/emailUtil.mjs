import nodemailer from 'nodemailer';
import customError from './customError.mjs';

const sendEmail = async (to, subject, text, next) => {
    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'thanh1612004@gmail.com', // Thay bằng email của bạn
                pass: 'kbuc cybk obpn loww', // Thay bằng app password của bạn
            },
        });

        let mailOptions = {
            from: 'thanh1612004@gmail.com',
            to: to,
            subject: subject,
            text: text,
        };
        await transporter.sendMail(mailOptions);
        console.log('Email has been sent successfully');
    } catch (err) {
        next(new customError("Can't send email", 500));
    }
};

export default sendEmail;
