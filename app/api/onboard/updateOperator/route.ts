import Operator from "@/model/operator";
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
        
        const { address, firstname, othername, lastname, country, location, national, verification, license, headshot } = await req.json();

        const operator = await Operator.findOneAndUpdate({address: address}, {
            
            firstname: firstname,
            othername: othername,
            lastname: lastname,
            country: country,
            location: location,
            national: national,
            verification: verification,
            license: license,
            headshot: headshot,
        }, { new: true });

        if (!operator) {
            return new Response(
                JSON.stringify({
                    error: "Operator not found",
                }),
                { status: 404 }
            );
        }


        return new Response(
            JSON.stringify(operator),
            { status: 200 }
        );

    } catch (error) {
        return new Response(
            JSON.stringify({
                error: "Failed to update operator",
                details: error
            }),
            { status: 500 }
        );

    }
}