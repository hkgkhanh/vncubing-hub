import '../../_styles/login/default.css';
import SignUpForm from "@/app/_components/auth/SignUpForm";

export const metadata = {
  title: {
    default: "Đăng ký",
  },
  description: "",
};

function Signup() {

    return (
        <div className="login-page">
            <SignUpForm />
        </div>
    );
}

export default Signup;