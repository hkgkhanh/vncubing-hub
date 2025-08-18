"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import '../../_styles/login/default.css';
import { Turnstile } from "next-turnstile";
import { hashPassword } from "@/app/utils/encryptPassword";
import { getPersonByWcaidOrEmail, createPerson } from "@/app/handlers/person";

export default function SignUpForm() {
    const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    const NODE_ENV = process.env.NEXT_PUBLIC_NODE_ENV;

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        gender: "u",
        dob: "",
        password: "",
        confirmPassword: "",
    });
    const [signupSuccess, setSignupSuccess] = useState(false);
    const router = useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Mật khẩu không khớp.");
            return;
        }

        console.log("Form submitted:", formData);
        // Call your Supabase handler or API here
        const data = await getPersonByWcaidOrEmail("none", formData.email);
        if (data.length > 0) {
            alert("Email này đã được sử dụng rồi.");
            return;
        }

        sessionStorage.setItem('signupFormData', JSON.stringify(formData));

        router.replace(`/signup/verify-email`);
        return;

        const newPerson = await createPerson({
            name: formData.name,
            gender: formData.gender,
            dob: formData.dob,
            wcaid: null,
            email: formData.email,
            hashed_password: await hashPassword(formData.password),
        });

        if (newPerson) {
            setSignupSuccess(true);
            setTimeout(() => {
                router.replace("/login");
            }, 2000);
        }
    };

    if (signupSuccess) {
        return (
            <div className="login-box">
                <h3>Đăng ký tài khoản thành công, bạn sẽ được chuyển hướng về trang đăng nhập.</h3>
            </div>
        )
    }

    return (
        <div className="login-box">
            <h2>Đăng ký</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Họ và tên<span className="required-field">*</span></label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </div>

                <div>
                    <label>Email<span className="required-field">*</span></label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>

                <div>
                    <label>Giới tính<span className="required-field">*</span></label>
                    <select id="gender" name="gender" value={formData.gender} onChange={handleChange}>
                        <option value="m">Nam</option>
                        <option value="f">Nữ</option>
                        <option value="o">Khác</option>
                        <option value="u">Không xác định</option>
                    </select>
                </div>

                <div>
                    <label>Ngày sinh<span className="required-field">*</span></label>
                    <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
                </div>

                <div>
                    <label>Mật khẩu<span className="required-field">*</span></label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>

                <div>
                    <label>Nhập lại mật khẩu<span className="required-field">*</span></label>
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                </div>


                <div className='turnstile-box'>
                    <Turnstile
                        siteKey={TURNSTILE_SITE_KEY}
                        retry="auto"
                        refreshExpired="auto"
                        sandbox={NODE_ENV === "development"}
                        className='turnstile-container'
                    />
                </div>
                <button type="submit">Đăng ký</button>
            </form>
            <div className="switch-auth">Đã có tài khoản? <a href="/login">Đăng nhập ngay</a></div>
        </div>
    );
}