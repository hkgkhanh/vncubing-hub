import { NextResponse } from 'next/server';
import { createPersonSession } from '@/app/lib/session';
import { getPersonByEmail } from '@/app/handlers/person';

export async function POST(request) {
    const body = await request.json();
    const { email } = body;

    const authData = await getPersonByEmail(email);

    if (authData.length <= 0 ) {
        return NextResponse.json({ ok: false });
    }

    console.log(authData);

    await createPersonSession(authData[0].id);
    return NextResponse.json({ ok: true });
}