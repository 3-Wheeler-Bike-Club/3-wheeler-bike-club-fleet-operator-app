"use server"


import nodemailer from "nodemailer"

export const sendVerifySelfAdminMail = async (firstname: string, othername: string, lastname: string) => {


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
            to: "3wheelerbikeclub@gmail.com", // Dynamic recipient email address
            subject: "Verification pending compliance review",
            html: `
                <p>A new verification has been submitted by ${firstname} ${othername} ${lastname},</p>

                <p>Please review the verification and approve or reject it.</p>

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


