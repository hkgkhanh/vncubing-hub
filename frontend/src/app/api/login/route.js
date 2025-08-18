import { NextResponse } from 'next/server';
import { createPersonSession } from '@/app/lib/session';
import { getPersonByEmail } from '@/app/handlers/person';
import { hashPassword } from '@/app/utils/encryptPassword';

export async function POST(request) {
    const body = await request.json();
    const { email, password } = body;

    const authData = await getPersonByEmail(email);
    const hashed_password = await hashPassword(password);

    if (authData.length <= 0 || (authData.length > 0 && authData[0].hashed_password != hashed_password)) {
        return NextResponse.json({ ok: false });
    }

    // console.log(authData);

    await createPersonSession(authData[0].id);
    return NextResponse.json({ ok: true });
}