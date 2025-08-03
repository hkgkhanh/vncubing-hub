export async function sendSignupVerificationMail(formData, code) {
    const res = await fetch('/api/vnca/send-email/verify-signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formData, code }),
    });

    return res.json();
}