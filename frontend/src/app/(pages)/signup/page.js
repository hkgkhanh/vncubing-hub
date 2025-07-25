// import logo from './logo_vnca.svg';
import '../../_styles/login/default.css';

export const metadata = {
  title: {
    default: "Đăng ký",
  },
  description: "",
};

function Signup() {
    return (
        <div className="login-page">
                <div className="login-box">
                    <h2>Đăng ký</h2>
                    <form>
                        <div>
                            <label>Email</label>
                            <input type="email" />
                        </div>
                        <div>
                            <label>Họ và tên</label>
                            <input type="name" />
                        </div>
                        <div>
                            <label>Mật khẩu</label>
                            <input type="password" />
                        </div>
                        <button type="submit">Đăng ký</button>
                    </form>
                </div>
        </div>
    );
}

export default Signup;