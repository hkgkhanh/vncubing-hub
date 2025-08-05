import '@/app/_styles/login/default.css';
import OrganiserForgetPasswordForm from '@/app/_components/auth/OrganiserForgetPasswordForm';

export const metadata = {
  title: {
    default: "Quên mật khẩu",
  },
  description: "",
};

function ForgetPassword() {

    return (
        <div className="login-page">
            <OrganiserForgetPasswordForm />
        </div>
    );
}

export default ForgetPassword;