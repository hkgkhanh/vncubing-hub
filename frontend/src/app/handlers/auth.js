export async function exchangeCode(code) {
    const res = await fetch('/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
    });

    const data = await res.json();
    console.log('Access Token:', data.access_token);
}

export async function getMyProfile(accessToken) {
    const res = await fetch('/api/me', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accessToken }),
    });

    const data = await res.json();
    console.log(data);
}

export async function loginWCA(code) {
    const res = await fetch('/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
    });

    const data = await res.json();
    // console.log('Access Token:', data.access_token);
    return data;
}