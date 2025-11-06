"use server";


import jwt from "jsonwebtoken"

export async function verifyPhoneCode( code: string, token: string ) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as { phone: string, code: string }
        if(decoded.code == code) {
            return true
        } else {
            return false
        }
    } catch (error) {
        console.error(error)
    }
}
