'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import '../../_styles/login/default.css';
import { exchangeCode, loginWCA, getMyProfile } from "../../handlers/auth";
import WcaLoginButton from '@/app/_components/WCALoginButton';

// export const metadata = {
//   title: {
//     default: "Đăng nhập",
//   },
//   description: "",
// };

function Login() {
    const [message, setMessage] = useState("Logging in...");
    const router = useRouter();

    useEffect(() => {
        async function handleLoginWCA() {
            const params = new URLSearchParams(window.location.search);
            const code = params.get("code");

            if (!code) {
                setMessage("No authorization code found.");
                return;
            }

            const accessTokenData = await loginWCA(code);
            console.log(accessTokenData);
            
            // redirect back to the user's previous site
            const redirectUrl = localStorage.getItem("redirectAfterLogin") || "/";
            localStorage.removeItem("redirectAfterLogin");
            router.replace("/");
            router.refresh();
        }

        handleLoginWCA();
        
    }, []);

    return (
        <div className="login-page">
            <div className="login-box">
                <h2>Đăng nhập</h2>
                <form>
                    <div>
                        <label>Email</label>
                        <input type="email" />
                    </div>
                    <div>
                        <label>Mật khẩu</label>
                        <input type="password" />
                    </div>
                    <button type="submit">Đăng nhập</button>
                </form>
                <div className="switch-auth">Chưa có tài khoản? <a href="/signup">Đăng ký ngay</a></div>
                {/* <button onClick={handleWCALogin}>Đăng nhập WCA</button> */}
                {/* <button onClick={handleGetMyProfile}></button> */}
                <WcaLoginButton />
            </div>
        </div>
    );
}

export default Login;