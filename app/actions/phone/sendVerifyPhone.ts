"use server";

// Download the helper library from https://www.twilio.com/docs/node/install
import twilio from "twilio";
import jwt from "jsonwebtoken"

// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export async function sendVerifyPhone( phone: string ) {
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const token = jwt.sign({ phone, code }, process.env.JWT_SECRET, { expiresIn: "10m" })

    console.log(phone);
    try {
        const message = await client.messages.create({
            from: `whatsapp:${process.env.THREEWB_WHATSAPP_BUSINESS_NUMBER}`,
            contentSid: 'HX0ca4b8dd289261ca7af771b1220cb503',
            contentVariables: `{"1":"${code}"}`,
            to: `whatsapp:${phone}`
        });
        console.log(message);
        return token;
    } catch (error) {
        console.log(error);
    }
}
