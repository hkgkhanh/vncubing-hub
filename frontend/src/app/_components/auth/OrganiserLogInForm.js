"use client";

import { useState } from 'react';
import { useRouter } from "next/navigation";
import '../../_styles/login/default.css';
import { organiserLogin } from "@/app/handlers/auth";

export default function PersonLogInForm() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleLogin(e) {
        e.preventDefault();

        setIsLoading(true);
        const user = await organiserLogin({ email, password });
        setIsLoading(false);

        if (user.ok == false) {
            alert("Email hoặc mật khẩu không đúng.");
            return;
        }

        console.log("Logged in");
        router.replace("/");
        router.refresh();
    }

    return (
        <div className="login-box">
            <h2>Đăng nhập cho nhà tổ chức cuộc thi</h2>
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
            <div className="switch-auth"><a href="/login/organiser/forget-password">Quên mật khẩu?</a></div>
        </div>
    );
}