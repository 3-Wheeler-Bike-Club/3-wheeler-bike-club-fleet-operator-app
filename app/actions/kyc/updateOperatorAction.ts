"use server"


export async function updateOperatorAction(
    address: `0x${string}`,
    firstname: string,
    othername: string,
    lastname: string,
    country: string,
    location: string,
    national: string[],
    verification: string,
    license: string[],
    headshot: string
) {
    try {
        const response = await fetch(`${process.env.BASE_URL}/api/kyc/updateOperator`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": process.env.THREEWB_API_KEY
            },
            body: JSON.stringify({ 
                address: address,
                firstname: firstname,
                othername: othername,
                lastname: lastname,
                country: country,
                location: location,
                national: national,
                verification: verification,
                license: license,
                headshot: headshot
            })
        })
        if (!response.ok) {
            throw new Error("Failed to update operator")
        }
        return response.json()
    } catch (error) { 
        console.log(error)
    }
}