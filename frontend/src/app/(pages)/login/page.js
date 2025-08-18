import '@/app/_styles/login/default.css';
import PersonLogInForm from '@/app/_components/auth/PersonLogInForm';
import LogInTabNavigation from '@/app/_components/auth/LogInTabNavigation';

export const metadata = {
  title: {
    default: "Đăng nhập",
  },
  description: "",
};

function Login() {

    return (
        <div className="login-page">
            <LogInTabNavigation activePage='person' />
            <PersonLogInForm />
        </div>
    );
}

export default Login;