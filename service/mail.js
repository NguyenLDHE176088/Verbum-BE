import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import dotenv from 'dotenv';

dotenv.config();
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
    debug: false,
    logger: true
});

//generate email body using mailgen
const MailGenerator = new Mailgen({
    theme: "default",
    product: {
        name: process.env.SITE_NAME,
        link: `http://localhost:${process.env.PORT}`
    }
})

const sendMailHelper = async (template) => {
    const emailBody = MailGenerator.generate(template.email_body);

    let mailOptions = {
        from: `${process.env.SITE_NAME} <${process.env.EMAIL}>`,
        to: template.to,
        subject: template.subject,
        html: emailBody
    };

    // Send email and handle potential errors
    try {
        let info = await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.error("Error occurred while sending email: ", error);
    }
};

export default {
    sendMailHelper
}