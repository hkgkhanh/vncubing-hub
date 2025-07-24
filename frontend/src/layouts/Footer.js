// import React, { useState, useEffect } from 'react';
import logo from '../assets/logo_vnca.png';
import '../styles/footer/default.css';
import teamsData from '../frontend_data/footer.json';
// import PublicIcon from '@mui/icons-material/Public';
// import FacebookIcon from '@mui/icons-material/Facebook';
// import MailIcon from '@mui/icons-material/Mail';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

library.add(fas, fab);

function Footer() {
    const teams = teamsData['teams'];
    const copyrightText = teamsData['logo_text'];

    return (
        <div className='footer'>
            <div className='logo'>
                <a href="/">
                    <img src={logo.src} alt={copyrightText} />
                </a>
                <div className="logo-text">{copyrightText}</div>
            </div>
            <div className='contact'>
                {teams.map((item, index) => (
                    <div className='team-contact' key={index}>
                        <div className='team-title'>{item.name}</div>
                        <div className='team-links'>
                            {/* <a href={item.link.website} target='_blank' rel="noopener noreferrer"><PublicIcon /><i className='fab fa-facebook-f'></i></a>
                            <a href={item.link.fb} target='_blank' rel="noopener noreferrer"><FacebookIcon /></a>
                            <a href={item.link.mail} target='_blank' rel="noopener noreferrer"><MailIcon /></a> */}
                            {item.links.map((link_item, link_index) => (
                                <a href={link_item.link} title={link_item.title} key={link_index} target='_blank' rel="noopener noreferrer">
                                    <FontAwesomeIcon icon={link_item.icon} />
                                </a>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Footer;