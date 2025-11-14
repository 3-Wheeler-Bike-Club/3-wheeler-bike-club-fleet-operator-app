import Guarantor from "@/model/guarantor";
import connectDB from "@/utils/db/mongodb";
import { middleware } from "@/utils/db/middleware";


export async function POST(
    req: Request,
) {
    const authResponse = middleware(req);
    if (authResponse.status !== 200) {
        return authResponse;
    }

    try {
        await connectDB();
        
        const { address, firstname, othername, lastname, country, location, national, verification, headshot } = await req.json();

        const guarantor = await Guarantor.findOneAndUpdate({address: address}, {
            
            firstname: firstname,
            othername: othername,
            lastname: lastname,
            country: country,
            location: location,
            national: national,
            verification: verification,
            headshot: headshot,
        }, { new: true });

        if (!guarantor) {
            return new Response(
                JSON.stringify({
                    error: "Guarantor not found",
                }),
                { status: 404 }
            );
        }


        return new Response(
            JSON.stringify(guarantor),
            { status: 200 }
        );

    } catch (error) {
        return new Response(
            JSON.stringify({
                error: "Failed to update guarantor",
                details: error
            }),
            { status: 500 }
        );

    }
}