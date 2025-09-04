import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
 
const secretKey = process.env.NEXT_PUBLIC_SESSION_PASSWORD;
const encodedKey = new TextEncoder().encode(secretKey);
 
export async function encrypt(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey);
}
 
export async function decrypt(session) {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    console.log('Failed to verify session');
  }
}

export async function createPersonSession(userId) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const session = await encrypt({ userId, expiresAt });
    const cookieStore = await cookies();
    
    cookieStore.set('person_session', session, {
        httpOnly: process.env.NEXT_PUBLIC_NODE_ENV === 'production',
        secure: true,
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    });
}

export async function updatePersonSession() {
    const session = (await cookies()).get('person_session')?.value;
    const payload = await decrypt(session);
    
    if (!session || !payload) {
        return null;
    }
    
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)(
        await cookies()
    ).set('person_session', session, {
        httpOnly: process.env.NEXT_PUBLIC_NODE_ENV === 'production',
        secure: true,
        expires: expires,
        sameSite: 'lax',
        path: '/',
    });
}

export async function createOrganiserSession(userId) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const session = await encrypt({ userId, expiresAt });
    const cookieStore = await cookies();
    
    cookieStore.set('organiser_session', session, {
        httpOnly: process.env.NEXT_PUBLIC_NODE_ENV === 'production',
        secure: true,
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    });
}

export async function updateOrganiserSession() {
    const session = (await cookies()).get('organiser_session')?.value;
    const payload = await decrypt(session);
    
    if (!session || !payload) {
        return null;
    }
    
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)(
        await cookies()
    ).set('organiser_session', session, {
        httpOnly: process.env.NEXT_PUBLIC_NODE_ENV === 'production',
        secure: true,
        expires: expires,
        sameSite: 'lax',
        path: '/',
    });
}

export async function getSession(key) {
    const session = (await cookies()).get(key)?.value;
    const decrypted = decrypt(session);

    return decrypted;
}

export async function deleteSession() {
    const cookieStore = await cookies();
    cookieStore.delete('person_session');
    cookieStore.delete('organiser_session');
}