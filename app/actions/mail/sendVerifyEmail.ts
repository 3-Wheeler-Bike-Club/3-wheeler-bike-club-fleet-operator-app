"use server"


import nodemailer from "nodemailer"
import jwt from "jsonwebtoken"

export const sendVerifyEmail = async (email: string) => {

    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const token = jwt.sign({ email, code }, process.env.JWT_SECRET, { expiresIn: "10m" })

    try {
        const transporter = nodemailer.createTransport({
            host: "smtppro.zoho.com",
            port: 465,
            secure: true, // Use `true` for port 465, `false` for all other ports
            auth: {
                user: process.env.FINANCE_3WB_USER,
                pass: process.env.FINANCE_3WB_PASS,
            },
        });
    
        const verifyEmail = {
            from: `Finance @ 3wb.club <${process.env.FINANCE_3WB_USER}>`,
            to: email, // Dynamic recipient email address
            subject: "Verify your email",
            html: `
                <p>Hi there,</p>

                <p>To verify your email, please use the following code:</p>
                <p><b>${code}</b></p>

                <p>This code will expire in 10 minutes.</p>
                <p>If you did not request this verification, please ignore this email.</p>

                <p>Warm regards,<br/>3wb.club</p>
            `,
        };
        const result = await transporter.sendMail(verifyEmail);
        console.log(result);
        if(result.accepted) {
            return token;
        }
    } catch (error) {
        console.log(error)
    }

}


