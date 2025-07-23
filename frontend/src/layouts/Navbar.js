import logo from '../logo_vnca.png';
import '../styles/navbar/default.css';

function Navbar() {
    return (
        <div className="navbar">
            <div className="logo">
                <a href="/">
                    <img src={logo} alt="Vietnam Cube Association" />
                </a>
            </div>
            <div className="nav-links">
                <a href="/">Trang chủ</a>
                <a href="/">Cuộc thi</a>
                <a href="/">Kết quả</a>
                <a href="/">Về chúng tôi</a>
            </div>
            <div className="auth">
                <a href="/">Đăng nhập</a>
                <a href="/">Đăng ký</a>
            </div>
        </div>
    );
}

export default Navbar;
