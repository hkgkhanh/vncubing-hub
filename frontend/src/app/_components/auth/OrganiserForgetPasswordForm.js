"use client";

import { useState, } from 'react';
import { useRouter } from "next/navigation";
import '../../_styles/login/default.css';
import { hashPassword } from "@/app/utils/encryptPassword";
import { generateCode } from "@/app/utils/codeGen";
import { updatePassword } from "@/app/handlers/organiser";
import { sendForgetPasswordVerificationMail } from "@/app/handlers/mailSender";

export default function PersonForgetPasswordForm() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [code, setCode] = useState(null);
    const [codeSentStatus, setCodeSentStatus] = useState(null);
    const [codeInputStatus, setCodeInputStatus] = useState(null);
    const [newPasswordStatus, setNewPasswordStatus] = useState(null);
    const [sentCode, setSentCode] = useState(false);
    const [codeVerified, setCodeVerified] = useState(false);
    const [codeInput, setCodeInput] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmitEmail = async (e) => {
        e.preventDefault();

        let code = await generateCode();
        setCode(code);
        setTimeout(() => setCode(null), 2 * 60 * 1000);

        let returnData = await sendForgetPasswordVerificationMail(email, code);

        if (!returnData) {
            setCodeSentStatus("failed");
            return;
        }
        setSentCode(true);
    }

    const handleSubmitCode = async (e) => {
        e.preventDefault();

        if (codeInput != code) {
            setCodeInputStatus("failed");
            return;
        }
        
        setCodeVerified(true);
    };
    
    const handleSubmitNewPassword = async (e) => {
        e.preventDefault();

        const status = await updatePassword({
            email,
            hashed_password: await hashPassword(newPassword),
        });

        if (status == 204) {
            setNewPasswordStatus(true);
            setTimeout(() => {
                router.replace("/login/organiser");
            }, 2000);
        }
    }

    async function handleResend(e) {
        e.preventDefault();

        let code = await generateCode();
        setCode(code);
        setTimeout(() => setCode(null), 2 * 60 * 1000);

        let returnData = await sendForgetPasswordVerificationMail(email, code);

        if (!returnData) {
            setCodeSentStatus("failed");
            return;
        }
        setSentCode(true);
    }

    if (newPasswordStatus) {
        return (
            <div className="login-box">
                <h3>Cập nhật mật khẩu thành công, bạn sẽ được chuyển hướng về trang đăng nhập.</h3>
            </div>
        )
    }

    if (codeVerified) {
        return (
            <div className="login-box">
                <h4>Nhập mật khẩu mới.</h4>
                <form onSubmit={handleSubmitNewPassword}>
                    <div>
                        <label>Mật khẩu mới<span className="required-field">*</span></label>
                        <input type="password" name="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                    </div>

                    <div>
                        <label>Nhập lại mật khẩu mới<span className="required-field">*</span></label>
                        <input type="password" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    </div>
                    
                    <button type="submit">Xác nhận</button>
                </form>
                { newPasswordStatus == "failed" &&
                    <div className="switch-auth required-field">Có lỗi trong quá trình cập nhật mật khẩu, hãy tải lại trang và thực hiện lại quá trình trên. Chúng tôi xin thứ lỗi vì sự bất tiện này.</div>
                }
            </div>
        );
    }

    if (sentCode) {
        return (
            <div className="login-box">
                <h4>Mã xác nhận đã được gửi đến email của bạn, hãy kiểm tra hộp thư.</h4>
                <form onSubmit={handleSubmitCode}>
                    <div>
                        <label>Nhập mã xác nhận<span className="required-field">*</span></label>
                        <input type="text" name="code" value={codeInput} onChange={(e) => setCodeInput(e.target.value)} required />
                    </div>
                    
                    <button type="submit">Đăng ký</button>
                </form>
                { codeInputStatus == "failed" &&
                    <div className="switch-auth required-field">Mã xác nhận sai hoặc có lỗi trong quá trình gửi mail, hãy yêu cầu gửi lại mã mới.</div>
                }
                <div className="switch-auth">Không nhận được mã xác nhận? <a href="#" onClick={handleResend}>Gửi lại mã.</a></div>
            </div>
        );
    }

    return (
        <div className="login-box">
            <h4>Nhập email của nhà tổ chức của bạn.</h4>
            <form onSubmit={handleSubmitEmail}>
                <div>
                    <label>Email<span className="required-field">*</span></label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <button type="submit">Xác nhận</button>
            </form>
            { codeSentStatus == "failed" &&
                <div className="switch-auth required-field">Có lỗi trong quá trình gửi mail, hãy yêu cầu gửi lại mã mới.</div>
            }
        </div>
    );
}