import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});


export const EmailOtp = async (email, name, otp) => {
    try {
        const info = await transporter.sendMail({
            from: '"Example Team" <team@example.com>',
            to: email,
            subject: "Hello create new account",
            text: "Hello world?",
            html: `
    hello ${name} your otp is ${otp}
    `
        });

        console.log("Message sent: %s", info.messageId);
    }
    catch (err) { console.log(err.message) }
}

// export const resent_otp = async(email, name, otp) => {
//     try {
//         const info = await transporter.sendMail({
//             // from: 'simranpahal46@gmail.com',
//             from: '"Example Team" <team@example.com>',
//             to: email,
//             subject: "Hello create new account",
//             text: "Hello world?",
//             html: `
//     hello ${name} your otp is ${otp}
//     `
//         });

//         console.log("Message sent: %s", info.messageId);
//     }
//     catch (err) { console.log(err.message) }
// }
