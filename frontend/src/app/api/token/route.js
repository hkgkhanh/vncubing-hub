import { NextResponse } from 'next/server';

export async function POST(request) {
    const body = await request.json();

    // https://www.worldcubeassociation.org/oauth/authorize?client_id=ftRTHOzvnLxPmxXaiDQczfA-qtOGomamYvi7XidS9WM&redirect_uri=http%3A%2F%2Flocalhost%3A3000&response_type=code&scope=%3Apublic+%3Adob+%3Aemail+%3Amanage_competitions+%3Aopenid+%3Aprofile

    const formData = new URLSearchParams();
    formData.append("grant_type", "authorization_code");
    formData.append("client_id", process.env.NEXT_PUBLIC_WCA_CLIENT_ID);
    formData.append("client_secret", process.env.NEXT_PUBLIC_WCA_CLIENT_SECRET);
    formData.append("code", body.code);
    formData.append("redirect_uri", process.env.NEXT_PUBLIC_REDIRECT_URI);

    const res = await fetch("https://www.worldcubeassociation.org/oauth/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
    });

    const data = await res.json();
    const response = NextResponse.json(data);

    // Set cookie (httpOnly, secure recommended)
    response.cookies.set("access_token", data.access_token, {
        httpOnly: true,
        path: "/",
        maxAge: response.expires_in,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });

    return response;
}