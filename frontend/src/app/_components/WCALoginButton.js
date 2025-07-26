"use client";

import React from "react";

function WcaLoginButton() {
    const handleLogin = () => {
        const fullUrl = window.location.href
        const currentOrigin = window.location.origin;

        // Store the full URL before redirecting
        localStorage.setItem("redirectAfterLogin", fullUrl);

        const params = new URLSearchParams({
            client_id: process.env.NEXT_PUBLIC_WCA_CLIENT_ID,
            redirect_uri: `${currentOrigin}/login`,
            response_type: "code",
            scope: "public dob email manage_competitions openid profile",
        });

        const authUrl = `https://www.worldcubeassociation.org/oauth/authorize?${params.toString()}`;

        window.location.href = authUrl;
    };

    return (
        <button onClick={handleLogin}>
            Login with WCA
        </button>
    );
}

export default WcaLoginButton;