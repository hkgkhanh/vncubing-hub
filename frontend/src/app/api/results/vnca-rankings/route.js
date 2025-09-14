import { NextResponse } from 'next/server';

export async function POST(request) {
    const body = await request.json();
    const { type, event, person_or_result } = body;

    const rankRes = await fetch(`https://raw.githubusercontent.com/hkgkhanh/vnca-db/refs/heads/main/api/rankings/${person_or_result}/${type == 'single' ? 'best' : 'average'}/${event}.json`, {
        method: "GET",
    });

    const rankContentType = rankRes.headers.get("content-type");

    if (!rankRes.ok) {
        const errorBody = rankContentType?.includes("application/json") ? await rankRes.json() : await rankRes.text();

        return NextResponse.json([]);
    }

    const rankData = await rankRes.json();
    return NextResponse.json(rankData);
}