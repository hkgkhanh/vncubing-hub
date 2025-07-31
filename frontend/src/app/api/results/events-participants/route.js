import { NextResponse } from 'next/server';

export async function GET(request) {
    // const body = await request.json();
    // const { type, event, person_or_result } = body;

    const rankRes = await fetch(`https://raw.githubusercontent.com/hkgkhanh/vn-wca-db/refs/heads/main/data/events_participants.json`, {
        method: "GET",
    });

    const rankContentType = rankRes.headers.get("content-type");

    if (!rankRes.ok) {
        const errorBody = rankContentType?.includes("application/json") ? await rankRes.json() : await rankRes.text();

        // return NextResponse.json([]);
        return NextResponse.json(
        { error: "Failed to fetch events participation", details: errorBody },
        { status: rankRes.status }
      );
    }

    const rankData = await rankRes.json();
    return NextResponse.json(rankData);
}