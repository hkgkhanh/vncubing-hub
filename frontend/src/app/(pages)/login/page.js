// import logo from './logo_vnca.svg';
import '../../_styles/login/default.css';

export const metadata = {
  title: {
    default: "Đăng nhập",
  },
  description: "",
};

function Login() {
    return (
        <div className="login-page">
            <div className="login-box">
                <h2>Đăng nhập</h2>
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
            </div>
        </div>
    );
}

export default Login;