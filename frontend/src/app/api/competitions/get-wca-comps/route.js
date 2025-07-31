import { NextResponse } from 'next/server';

export async function GET(request) {
    // const body = await request.json();
    // const countryId = body.countryId;

    const res = await fetch(`https://raw.githubusercontent.com/hkgkhanh/vn-wca-db/refs/heads/main/api/competitions.json`, {
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