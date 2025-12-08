"use server"

export async function getGuarantorAction(address: string) {
    try {
        const response = await fetch(`${process.env.BASE_URL}/api/onboard/getGuarantor`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": process.env.THREEWB_API_KEY
            },
            body: JSON.stringify({ address: address })
        })
        if (!response.ok) {
            throw new Error("Failed to get guarantor")
        }
        return response.json()
    } catch (error) {
        console.log(error)
    }
}