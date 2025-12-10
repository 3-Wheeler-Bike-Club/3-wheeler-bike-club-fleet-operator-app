"use server"


import nodemailer from "nodemailer"

export const sendVerifyPendingAdminMail = async (firstname: string, othername: string, lastname: string, type: "operator" | "guarantor") => {


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
            const verifyOperatorPendingAdminEmail = {
                from: `Operator @ 3wb.club <${process.env.FINANCE_3WB_USER}>`,
                to: "3wheelerbikeclub@gmail.com", // Dynamic recipient email address
                subject: "Verification pending compliance review",
                html: `
                    <p>A new operator identity verification has been submitted by ${firstname} ${othername} ${lastname},</p>
    
                    <p>Please review the identity documents and approve or reject it.</p>
    
                    <p>Warm regards,<br/>3wb.club</p>
                `,
            };
            const result = await transporter.sendMail(verifyOperatorPendingAdminEmail);
            console.log(result);
            if(result.accepted) {
                return true;
            }
        } else if(type === "guarantor") {
            const verifyGuarantorPendingAdminEmail = {
                from: `Guarantor @ 3wb.club <${process.env.FINANCE_3WB_USER}>`,
                to: "3wheelerbikeclub@gmail.com", // Dynamic recipient email address
                subject: "Verification pending compliance review",
                html: `
                    <p>A new guarantor identity verification has been submitted by ${firstname} ${othername} ${lastname},</p>
    
                    <p>Please review the identity documents and approve or reject it.</p>
    
                    <p>Warm regards,<br/>3wb.club</p>
                `,
            };
            const result = await transporter.sendMail(verifyGuarantorPendingAdminEmail);
            console.log(result);
            if(result.accepted) {
                return true;
            }
        }
        
    } catch (error) {
        console.log(error)
    }

}


