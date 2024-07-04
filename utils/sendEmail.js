import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config();
function sendEmail(email, username, otp) {
    // Create a transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.USER, // replace with your email
            pass: process.env.PASSword // replace with your email password or app-specific password
        }
    });

    // Email options
    const mailOptions = {
        from: {
            name : 'khansa',
            address : process.env.USER
        }, // sender address
        to: email, // list of receivers
        subject: 'Welcome to Our Service', // Subject line
        text: `Hello ${username},\n\nThank you for registering at our service.   
        Your OTP is ${otp}
    We are happy to have you on board! Best regards,\nTeam` // plain text body
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log('Error sending email:', error);
        }
        console.log('Email sent:', info.response);
    });
}

export {sendEmail}