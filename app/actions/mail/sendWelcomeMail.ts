"use server"


import nodemailer from "nodemailer"

export const sendWelcomeEmail = async (email: string, type: "operator" | "guarantor") => {

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
    
        if(type === "operator") {
            const welcomeOperatorEmail = {
                from: `Operator @ 3wb.club <${process.env.FINANCE_3WB_USER}>`,
                to: email, // Dynamic recipient email address
                subject: "Welcome to 3WB Fleet Operator",
                html: `
                    <p>Hi there,</p>
    
                    <p>Your have successfully registered to be 3-Wheeler Fleet Operator. You can now start operating your fleet and earn a living of your own.</p>
    
                    <p>Thank you for trusting us for a pre-financed 3-wheeler, and as always, drive safe!</p>
    
                    <p>Warm regards,<br/>3wb.club</p>
                `,
            };
            const result = await transporter.sendMail(welcomeOperatorEmail);
            return result;
    
        } else if(type === "guarantor") {
            const welcomeGuarantorEmail = {
                from: `Guarantor @ 3wb.club <${process.env.FINANCE_3WB_USER}>`,
                to: email, // Dynamic recipient email address
                subject: "Welcome to 3WB Fleet Operator",
                html: `
                    <p>Hi there,</p>
    
                    <p>Your have successfully registered to be a guarantor to a 3-Wheeler Fleet Operator. You can now a follow your operators progress on their journey to earn a living of your own.</p>
    
                    <p>Thank you for supporting us to provide earning opportunities for Operators, and as always, stay safe!</p>
    
                    <p>Warm regards,<br/>3wb.club</p>
                `,
            };
            const result = await transporter.sendMail(welcomeGuarantorEmail);
            return result;
        }
    } catch (error) {
        console.log(error)
    }

}


