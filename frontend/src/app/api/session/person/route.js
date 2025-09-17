import { getSession } from '@/app/lib/session';
import { NextResponse } from 'next/server';

export async function GET(req) {
    const session = await getSession('person_session');
    // console.log(session);
    return NextResponse.json({ ok: true, data: session.userId });
}