// import logo from './logo_vnca.svg';
import '../../styles/login/default.css';
import Navbar from '../../layouts/Navbar';
import Footer from '../../layouts/Footer';

function Login() {
    return (
        <div className="login-page">
            <Navbar />
            <div className="login-container">
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
            <Footer />
        </div>
    );
}

export default Login;