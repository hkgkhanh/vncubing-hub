import { NextResponse } from 'next/server';
import { createOrganiserSession } from '@/app/lib/session';
import { getOrganiserByEmail } from '@/app/handlers/organiser';
import { hashPassword } from '@/app/utils/encryptPassword';

export async function POST(request) {
    const body = await request.json();
    const { email, password } = body;

    const authData = await getOrganiserByEmail(email);
    const hashed_password = await hashPassword(password);

    // console.log(hashed_password);
    // console.log(authData);

    if (authData.length <= 0 || (authData.length > 0 && authData[0].hashed_password != hashed_password)) {
        return NextResponse.json({ ok: false });
    }

    // console.log(authData);

    await createOrganiserSession(authData[0].id);
    return NextResponse.json({ ok: true });
}