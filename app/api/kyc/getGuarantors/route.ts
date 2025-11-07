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
        const guarantors = await Guarantor.find({});


        if (!guarantors) {
            return new Response(
                JSON.stringify({
                    error: "Guarantors not found",
                }),
                { status: 404 }
            );
        }


        return new Response(
            JSON.stringify(guarantors),
            { status: 200 }
        );

    } catch (error) {   
        return new Response(
            JSON.stringify({
                error: "Failed to fetch guarantors",
                details: error
            }),
            { status: 500 }
        );

    }
}