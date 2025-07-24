// import logo from './logo_vnca.svg';
import '../../styles/login/default.css';
import Navbar from '../../layouts/Navbar';
import Footer from '../../layouts/Footer';

function Signup() {
    return (
        <div className="login-page">
            <Navbar />
            <div className="login-container">
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
            <Footer />
        </div>
    );
}

export default Signup;