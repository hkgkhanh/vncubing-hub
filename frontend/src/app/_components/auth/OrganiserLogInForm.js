"use client";

import { useRouter } from "next/navigation";
import '../../_styles/login/default.css';

export default function PersonLogInForm() {
    const router = useRouter();

    return (
        <div className="login-box">
            <h2>Đăng nhập cho nhà tổ chức cuộc thi</h2>
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
            <div className="switch-auth"><a href="/signup">Quên mật khẩu?</a></div>
        </div>
    );
}