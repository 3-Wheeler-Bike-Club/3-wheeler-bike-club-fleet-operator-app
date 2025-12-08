// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import Operator from "@/model/operator"
import connectDB from "@/utils/db/mongodb"
import { middleware } from "@/utils/db/middleware"

export async function POST(
    req: Request,
) {
    const authResponse = middleware(req)
    if (authResponse.status !== 200) {
        return authResponse
    }

    const { address, email, phone } = await req.json()
    
    try {
        await connectDB()
        
        // Check if operator already exists
        const existingAddress = await Operator.findOne({ address })
        if (existingAddress) {
            return new Response(
                JSON.stringify({ error: "Address already exists" }),
                { status: 406 }
            )
        }
        const existingEmail = await Operator.findOne({ email })
        if (existingEmail) {
            return new Response(
                JSON.stringify({ error: "Email already exists" }),
                { status: 409 }
            )
        }
        const existingPhone = await Operator.findOne({ phone })
        if (existingPhone) {
            return new Response(
                JSON.stringify({ error: "Phone already exists" }),
                { status: 409 }
            )
        }
        const operator = await Operator.create({ 
            address: address,
            email: email,
            phone: phone,
        })
        return new Response(JSON.stringify(operator))
    } catch (error) {
        return new Response(JSON.stringify(error))
    }
}