import '@/app/_styles/login/default.css';
import OrganiserLogInForm from '@/app/_components/auth/OrganiserLogInForm';
import LogInTabNavigation from '@/app/_components/auth/LogInTabNavigation';

export const metadata = {
  title: {
    default: "Đăng nhập",
  },
  description: "",
};

function OrganiserLogin() {

    return (
        <div className="login-page">
            <LogInTabNavigation activePage='organiser' />
            <OrganiserLogInForm />
        </div>
    );
}

export default OrganiserLogin;