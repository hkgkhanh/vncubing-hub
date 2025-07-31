import { NextResponse } from 'next/server';

export async function POST(request) {
    const body = await request.json();
    const { type, event, person_or_result } = body;

    const rankRes = await fetch(`https://raw.githubusercontent.com/hkgkhanh/vn-wca-db/refs/heads/main/api/rank/${event}_${type}_100_${person_or_result}.json`, {
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