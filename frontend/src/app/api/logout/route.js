import { NextResponse } from 'next/server';
import { deleteSession } from '@/app/lib/session';

export async function POST(request) {
    await deleteSession();
    return NextResponse.json({ ok: true });
}