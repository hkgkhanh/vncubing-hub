import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "@/lib/session";

export const POST = withIronSessionApiRoute(
    async function logoutRoute(req, res) {
        req.session.destroy();
        return new Response(null, { status: 200 });
    },
    sessionOptions
);