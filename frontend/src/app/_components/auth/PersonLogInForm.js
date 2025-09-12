"use client";

import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import '../../_styles/login/default.css';
import { exchangeCode, loginWCA, getMyProfile, login } from "../../handlers/auth";
import WcaLoginButton from '@/app/_components/WCALoginButton';

export default function PersonLogInForm() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function handleLoginWCA() {
            const params = new URLSearchParams(window.location.search);
            const code = params.get("code");

            if (!code) {
                return;
            }

            const accessTokenData = await loginWCA(code);
            // console.log(accessTokenData);
            
            // redirect back to the user's previous site
            const redirectUrl = localStorage.getItem("redirectAfterLogin") || "/";
            localStorage.removeItem("redirectAfterLogin");
            router.replace("/");
            router.refresh();
        }

        handleLoginWCA();
        
    }, []);

    async function handleLogin(e) {
        e.preventDefault();

        setIsLoading(true);
        const user = await login({ email, password });
        setIsLoading(false);

        if (user.ok == false) {
            alert("Email hoặc mật khẩu không đúng.");
            return;
        }

        // console.log("Logged in");
        router.replace("/");
        router.refresh();
    }

    return (
        <div className="login-box">
            <h2>Đăng nhập</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                    <label>Mật khẩu</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit" disabled={isLoading}>{!isLoading ? "Đăng nhập" : "Đang đăng nhập..."}</button>
            </form>
            <div className="switch-auth"><a href="/login/forget-password">Quên mật khẩu?</a></div>
            <div className="switch-auth">Chưa có tài khoản? <a href="/signup">Đăng ký ngay</a></div>

            <div className='center-text'>Hoặc</div>
            <WcaLoginButton />
        </div>
    );
}