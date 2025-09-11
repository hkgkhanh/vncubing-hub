import React from 'react';
import '../../_styles/footer/default.css';
import teamsData from '../../../data/footer.json';
import navbarData from '../../../data/header.json';

function Footer() {
    const teams = teamsData['teams'];
    const copyrightLabel = teamsData['copyright_label'];
    const orgName = teamsData['org_name'];
    const currentYear = new Date().getFullYear();
    const logoData = navbarData['logo'];

    return (
        <div className='footer'>
            <div className='logo'>
                <a href="/">
                    <img src={logoData.image} alt={orgName} />
                </a>
                <div className="logo-text">{`${copyrightLabel}${currentYear}${orgName}`}</div>
            </div>
            <div className='contact'>
                {teams.map((item, index) => (
                    <div className='team-contact' key={index}>
                        <div className='team-title'>{item.name}</div>
                        <div className='team-links'>
                            {item.links.map((link_item, link_index) => (
                                <a href={link_item.link} title={link_item.title} key={link_index} target='_blank' rel="noopener noreferrer" dangerouslySetInnerHTML={{ __html: link_item.icon }}></a>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Footer;