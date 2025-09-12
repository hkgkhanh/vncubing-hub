export async function exchangeCode(code) {
    const res = await fetch('/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
    });

    const data = await res.json();
    // console.log('Access Token:', data.access_token);
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
    // console.log(data);
    return data;
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

export async function login({ email, password }) {
    const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    return data;
}

export async function WCALogin({ email }) {
    const res = await fetch('/api/login/wca', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });

    const data = await res.json();
    return data;
}

export async function organiserLogin({ email, password }) {
    const res = await fetch('/api/organiser/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    return data;
}

export async function logout() {
    const res = await fetch('/api/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    const data = await res.json();
    return data;
}