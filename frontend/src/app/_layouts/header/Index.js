import React from 'react';
import '../../_styles/header/default.css';
import navbarData from '../../../data/header.json';
import LogoutButton from '@/app/_components/LogoutButton';

function Header({ isLoggedIn }) {
    // const [lang, setLang] = useState('vi');
    const lang = "vi";
    const navLinks = navbarData['nav-links'];
    const authLinks = navbarData['auth'];
    const logoData = navbarData['logo'];

    return (
        <div className="navbar" id='navbar'>
            <div className="logo">
                <a href="/">
                    <img src={logoData.image} alt={logoData.alt} id="logo" />
                </a>
            </div>
            
            <div className="nav-links">
                {navLinks.map((item, index) => (
                    <a href={item.link} key={index}>
                        {lang === 'vi' ? item.label_vi : item.label_en}
                    </a>
                ))}
            </div>
            {/* <div className="auth"> */}
                {/* <select value={lang} onChange={(e) => handleSetLang(e)}>
                    <option value="vi">Tiếng Việt</option>
                    <option value="en">English</option>
                </select> */}
                {isLoggedIn ? (
                    <div className="auth">
                        <LogoutButton />
                    </div>
                ) : (
                    <div className="auth">
                        <a href={authLinks.login.link}>
                            {lang === 'vi' ? authLinks.login.label_vi : authLinks.login.label_en}
                        </a>
                        <a href={authLinks.signup.link}>
                            {lang === 'vi' ? authLinks.signup.label_vi : authLinks.signup.label_en}
                        </a>
                    </div>
                )}

                {/* <a href={authLinks.login.link}>
                    {lang === 'vi' ? authLinks.login.label_vi : authLinks.login.label_en}
                </a>
                <a href={authLinks.signup.link}>
                    {lang === 'vi' ? authLinks.signup.label_vi : authLinks.signup.label_en}
                </a> */}
            {/* </div> */}
        </div>
    );
}

export default Header;