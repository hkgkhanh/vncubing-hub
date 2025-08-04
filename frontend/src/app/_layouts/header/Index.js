'use client';

import React, { useState, useEffect } from 'react';
import '../../_styles/header/default.css';
import navbarData from '../../../data/header.json';
import LogoutButton from '@/app/_components/LogoutButton';

function Header({ isLoggedInPerson, isLoggedInOrganiser }) {
    // const [lang, setLang] = useState('vi');
    const lang = "vi";
    const navLinks = navbarData['nav-links'];
    const authLinks = navbarData['auth'];
    const logoData = navbarData['logo'];

    const [navbarIsOpen, setNavbarIsOpen] = useState(true);

    useEffect(() => {
        const updateNavVisibility = () => {
            const isLargeScreen = window.matchMedia("(min-width: 992px)").matches;
            setNavbarIsOpen(isLargeScreen);
        };

        updateNavVisibility();

        window.addEventListener("resize", updateNavVisibility);

        return () => {
            window.removeEventListener("resize", updateNavVisibility);
        };
    }, []);

    const handleToggleNav = () => {
        if (window.innerWidth < 992) {
        setNavbarIsOpen((prev) => !prev);
        }
    };

    return (
        <div className="navbar" id='navbar'>
            <div className="logo">
                <a href="/">
                    <img src={logoData.image} alt={logoData.alt} id="logo" />
                </a>
                <a href="#" className='toggle-navbar' onClick={handleToggleNav}>
                    <img src={`/ui/list.svg`} alt="" />
                </a>
            </div>
            
            <div className={`nav-links ${navbarIsOpen ? "open" : ""}`}>
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
                {isLoggedInPerson && (
                    <div className={`auth ${navbarIsOpen ? "open" : ""}`}>
                        <LogoutButton />
                    </div>
                )}

                {isLoggedInOrganiser && (
                    <div className={`auth ${navbarIsOpen ? "open" : ""}`}>
                        <LogoutButton />
                    </div>
                )}

                {(!isLoggedInPerson && !isLoggedInOrganiser) && (
                    <div className={`auth ${navbarIsOpen ? "open" : ""}`}>
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