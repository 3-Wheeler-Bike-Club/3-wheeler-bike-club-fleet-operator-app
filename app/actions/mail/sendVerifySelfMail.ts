"use server"


import nodemailer from "nodemailer"

export const sendVerifySelfMail = async (email: string, name: string) => {


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
    
        const verifyPendingEmail = {
            from: `Finance @ 3wb.club <${process.env.FINANCE_3WB_USER}>`,
            to: email, // Dynamic recipient email address
            subject: "Your verification is pending team review",
            html: `
                <p>Hi ${name},</p>

                <p>Your verification is pending team review. Please note that this process may take 24-48 hours to complete.</p>

                <p>We will notify you once your verification has been reviewed. In the meantime, please standby for updates.</p>

                <p>If you have any questions or concerns, feel free to reach out to our support team.</p>

                <p>Warm regards,<br/>3wb.club</p>
            `,
        };
        const result = await transporter.sendMail(verifyPendingEmail);
        console.log(result);
        if(result.accepted) {
            return true;
        }
    } catch (error) {
        console.log(error)
    }

}


