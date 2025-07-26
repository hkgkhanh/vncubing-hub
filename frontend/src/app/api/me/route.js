import { NextResponse } from 'next/server';

export async function POST(request) {
    const body = await request.json();

    const res = await fetch("https://www.worldcubeassociation.org/api/v0/me", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${body.accessToken}`,
        },
    });

    console.log(res);

    const contentType = res.headers.get("content-type");

    if (!res.ok) {
      const errorBody = contentType?.includes("application/json")
        ? await res.json()
        : await res.text();

      return NextResponse.json(
        { error: "Failed to fetch user info", details: errorBody },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
}