"use server"

import jwt from "jsonwebtoken"

export const verifyMailCode = async (token: string, code: string) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as { email: string, code: string }
        if(decoded.code == code) {
            return true
        } else {
            return false
        }
    } catch (error) {
        console.error(error)
    }
}
