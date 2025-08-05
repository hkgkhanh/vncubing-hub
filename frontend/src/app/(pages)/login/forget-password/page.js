import '@/app/_styles/login/default.css';
import PersonForgetPasswordForm from '@/app/_components/auth/PersonForgetPasswordForm';

export const metadata = {
  title: {
    default: "Quên mật khẩu",
  },
  description: "",
};

function ForgetPassword() {

    return (
        <div className="login-page">
            <PersonForgetPasswordForm />
        </div>
    );
}

export default ForgetPassword;