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
        const operators = await Operator.find({});


        if (!operators) {
            return new Response(
                JSON.stringify({
                    error: "Operators not found",
                }),
                { status: 404 }
            );
        }


        return new Response(
            JSON.stringify(operators),
            { status: 200 }
        );

    } catch (error) {
        return new Response(
            JSON.stringify({
                error: "Failed to fetch operators",
                details: error
            }),
            { status: 500 }
        );

    }
}