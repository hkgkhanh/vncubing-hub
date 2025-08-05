"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import '../../_styles/login/default.css';
import { hashPassword } from "@/app/utils/encryptPassword";
import { generateCode } from "@/app/utils/codeGen";
import { createPerson } from "@/app/handlers/person";
import { sendSignupVerificationMail } from "@/app/handlers/mailSender";

export default function VerifySignUpForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        gender: "u",
        dob: "",
        password: ""
    });
    const [code, setCode] = useState(null);
    const [userCode, setUserCode] = useState(null);
    const [codeInputStatus, setCodeInputStatus] = useState(null);
    const [signupSuccess, setSignupSuccess] = useState(false);
    const router = useRouter();

    useEffect(() => {
        async function handleSendCode() {
            const saved = sessionStorage.getItem('signupFormData');
            if (saved) setFormData(JSON.parse(saved));

            let code = await generateCode();
            setCode(code);
            setTimeout(() => setCode(null), 2 * 60 * 1000);

            let returnData = await sendSignupVerificationMail(formData, code);
            // console.log(returnData);

            if (!returnData) {
                setCodeInputStatus("failed");
            }
        }
        
        handleSendCode();

    }, []);

    const handleChange = (e) => {
        setUserCode(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (userCode != code) {
            setCodeInputStatus("failed");
            return;
        }
        
        sessionStorage.removeItem('signupFormData');

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

    async function handleResend() {
        const saved = sessionStorage.getItem('signupFormData');
        if (saved) setFormData(JSON.parse(saved));
        sessionStorage.removeItem('signupFormData');

        
        let code = await generateCode();
        setCode(code);
        let returnData = await sendSignupVerificationMail(formData, code);
        // console.log(returnData);

        if (!returnData) {
            setCodeInputStatus("failed");
        }
    }

    if (signupSuccess) {
        return (
            <div className="login-box">
                <h3>Đăng ký tài khoản thành công, bạn sẽ được chuyển hướng về trang đăng nhập.</h3>
            </div>
        )
    }

    return (
        <div className="login-box">
            <h4>Mã xác nhận đã được gửi đến email của bạn, hãy kiểm tra hộp thư.</h4>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nhập mã xác nhận<span className="required-field">*</span></label>
                    <input type="text" name="code" onChange={handleChange} required />
                </div>
                
                <button type="submit">Đăng ký</button>
            </form>
            { codeInputStatus == "failed" &&
                <div className="switch-auth">Mã xác nhận sai hoặc có lỗi trong quá trình gửi mail, hãy yêu cầu gửi lại mã mới.</div>
            }
            <div className="switch-auth">Không nhận được mã xác nhận? <a href="#" onClick={handleResend}>Gửi lại mã.</a></div>
        </div>
    );
}