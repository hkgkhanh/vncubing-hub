import '@/app/_styles/login/default.css';
import VerifySignUpForm from "@/app/_components/auth/VerifySignUpForm";

export const metadata = {
  title: {
    default: "Đăng ký",
  },
  description: "",
};

function VerifySignupCode() {

    return (
        <div className="login-page">
            <VerifySignUpForm />
        </div>
    );
}

export default VerifySignupCode;