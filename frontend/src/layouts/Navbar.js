import React, { useState, useEffect } from 'react';
import logo from '../logo_vnca.png';
import '../styles/navbar/default.css';
import navbarData from '../frontend_data/navbar.json';

function Navbar() {
    const [lang, setLang] = useState('vi');
    const navLinks = navbarData['nav-links'];
    const authLinks = navbarData['auth'];


    window.onscroll = function() {scrollFunction()};

    function scrollFunction() {
        if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
            document.getElementById("navbar").classList.add("scrolled");
        } else {
            document.getElementById("navbar").classList.remove("scrolled");
        }
    }

    function handleSetLang(e) {
        setLang(e.target.value);
        localStorage.setItem('lang', e.target.value);
    }

    useEffect(() => {
        const savedLang = localStorage.getItem('lang');
        if (savedLang) {
            setLang(savedLang);
        }
    }, []);

    return (
        <div className="navbar" id='navbar'>
            <div className="logo">
                <a href="/">
                    <img src={logo} alt="Vietnam Cube Association" />
                </a>
            </div>
            
            <div className="nav-links">
                {navLinks.map((item, index) => (
                    <a href={item.link} key={index}>
                        {lang === 'vi' ? item.label_vi : item.label_en}
                    </a>
                ))}
            </div>
            <div className="auth">
                {/* <select value={lang} onChange={(e) => handleSetLang(e)}>
                    <option value="vi">Tiếng Việt</option>
                    <option value="en">English</option>
                </select> */}

                <a href={authLinks.login.link}>
                    {lang === 'vi' ? authLinks.login.label_vi : authLinks.login.label_en}
                </a>
                <a href={authLinks.signup.link}>
                    {lang === 'vi' ? authLinks.signup.label_vi : authLinks.signup.label_en}
                </a>
            </div>
        </div>
    );
}

export default Navbar;
