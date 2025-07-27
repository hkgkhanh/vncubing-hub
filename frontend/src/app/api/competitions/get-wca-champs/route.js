import { NextResponse } from 'next/server';

export async function POST(request) {
    const body = await request.json();
    const page = body.page;

    const res = await fetch(`https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/master/api/championships-page-${page}.json`, {
        method: "GET",
    });

    const contentType = res.headers.get("content-type");

    if (!res.ok) {
      const errorBody = contentType?.includes("application/json") ? await res.json() : await res.text();

      return NextResponse.json(
        { error: "Failed to fetch WCA comps", details: errorBody },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
}