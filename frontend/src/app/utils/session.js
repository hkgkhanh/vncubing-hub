import { IronSessionOptions } from "iron-session";

export const sessionOptions = {
    password: process.env.SESSION_PASSWORD,
    cookieName: "vncubing_session",
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
    },
};