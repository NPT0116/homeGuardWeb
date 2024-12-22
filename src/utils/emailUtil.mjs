import nodemailer from 'nodemailer';
import customError from './customError.mjs';

const sendEmail = async (to, subject, text, next) => {
    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'quangduypham1405@gmail.com', // Thay bằng email của bạn
                pass: 'znry vjfc sxzf khoa',
            },
        });

        let mailOptions = {
            from: 'quangduypham1405@gmail.com',
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
