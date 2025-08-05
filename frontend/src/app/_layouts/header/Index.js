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
    const [meBoxIsOpen, setMeBoxIsOpen] = useState(false);

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
        if (window.innerWidth < 992) setNavbarIsOpen((prev) => !prev);
    };

    const handleToggleMeBox = () => {
        setMeBoxIsOpen((prev) => !prev);
    }

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

            {isLoggedInPerson && (
                <div className={`auth ${navbarIsOpen ? "open" : ""}`}>
                    {/* <LogoutButton /> */}
                    <div className='toggle-me' onClick={handleToggleMeBox}>
                        <img src={`/ui/user.svg`} alt="" />
                    </div>

                    <div className={`me-box ${meBoxIsOpen ? "open" : ""}`} id="me-box">
                        <a href="/me">Tài khoản</a>
                        <LogoutButton />
                    </div>
                </div>
            )}

            {isLoggedInOrganiser && (
                <div className={`auth ${navbarIsOpen ? "open" : ""}`}>
                    {/* <LogoutButton /> */}
                    <div className='toggle-me' onClick={handleToggleMeBox}>
                        <img src={`/ui/organiser.svg`} alt="" />
                    </div>

                    <div className={`me-box ${meBoxIsOpen ? "open" : ""}`} id="me-box">
                        <a href="/me">Tài khoản</a>
                        <a href="/manage-competition">Quản lý cuộc thi</a>
                        <LogoutButton />
                    </div>
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
        </div>
    );
}

export default Header;