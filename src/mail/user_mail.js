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
            from: 'simranpahal46@gmail.com', 
            to: email, 
            subject: "Hello",
            text: "Hello world?", 
            html: `<b>Hello world? ${email} ${name} ${otp}</b>`, 
        });

    }
    catch (err) { console.log(err.message) }
}

export const resent_otp=(email,name,otp)=>{
console.log(email,name,otp)
}
