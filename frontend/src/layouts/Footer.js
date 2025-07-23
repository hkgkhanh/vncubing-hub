// import React, { useState, useEffect } from 'react';
import logo from '../logo_vnca.png';
import '../styles/footer/default.css';
import teamsData from '../frontend_data/footer.json';
import PublicIcon from '@mui/icons-material/Public';
import FacebookIcon from '@mui/icons-material/Facebook';
import MailIcon from '@mui/icons-material/Mail';

function Footer() {
    const teams = teamsData['teams'];
    return (
        <div className='footer'>
            <div className='logo'>
                <a href="/">
                    <img src={logo} alt="Vietnam Cube Association" />
                </a>
                <div className="logo-text">© Vietnam Cube Association 2025.</div>
            </div>
            <div className='contact'>
                {teams.map((item, index) => (
                    <div className='team-contact' key={index}>
                        <div className='team-title'>{item.name}</div>
                        <div className='team-links'>
                            <a href={item.link.website} target='_blank' rel="noopener noreferrer"><PublicIcon /></a>
                            <a href={item.link.fb} target='_blank' rel="noopener noreferrer"><FacebookIcon /></a>
                            <a href={item.link.mail} target='_blank' rel="noopener noreferrer"><MailIcon /></a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Footer;