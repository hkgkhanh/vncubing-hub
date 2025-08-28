import { getSession } from '@/app/lib/session';
import { NextResponse } from 'next/server';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("user");
    const session = await getSession(key);
    return NextResponse.json({ userId: session.userId });
}