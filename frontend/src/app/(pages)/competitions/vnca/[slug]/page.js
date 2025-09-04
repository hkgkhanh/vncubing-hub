'use client';

import React, { useState, useEffect } from 'react';
import { getCompById } from '@/app/handlers/comps';
import '@/app/_styles/competitions/vnca/default.css';
import AppData from "@/data/app.json";
import { nameToSlug } from '@/app/utils/codeGen';
import CompInfoTab from '@/app/_components/competitions/comp-details/CompInfoTab';
import CompGeneralInfo from '@/app/_components/competitions/comp-details/CompGeneralInfo';

export default function CompetitionPage({ params }) {
    const { slug } = React.use(params);
    const [compData, setCompData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [tabOpening, setTabOpening] = useState('thong-tin-chung');

    useEffect(() => {
        async function fetchComp() {
            setIsLoading(true);
            const compId = parseInt(slug.split("-").at(-1));

            const data = await getCompById(compId);

            if (!data.ok) alert("Tải trang thất bại, vui lòng thử lại.");

            console.log(data.data);
            setCompData(data.data);
            document.title = `${data.data.name} | ${AppData.settings.siteName}`;

            const hashPart = window.location.hash;
            if (hashPart) setTabOpening(hashPart.slice(1));
            
            setIsLoading(false);
        }
        
        fetchComp();
    }, []);

    const handleChangeTab = (slug) => {
        setTabOpening(slug);
        window.location.hash = slug;
    }

    if (isLoading) return (
        <div className='spinner-container'>
            <img
                src="/ui/spinner.svg"
                alt="Loading"
                className="spinner"
                title="Loading"
            />
        </div>
    );

    return (
        <div className="competition-page">
            <div className='comp-name'><h1>{compData.name}</h1></div>
            <div className='comp-page-container'>
                <div className='comp-page-nav'>
                    <div className='comp-page-nav-list'>
                        <a href={`/competitions/vnca/${slug}`} className='active' onClick={(e) => e.preventDefault()}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM288 224C288 206.3 302.3 192 320 192C337.7 192 352 206.3 352 224C352 241.7 337.7 256 320 256C302.3 256 288 241.7 288 224zM280 288L328 288C341.3 288 352 298.7 352 312L352 400L360 400C373.3 400 384 410.7 384 424C384 437.3 373.3 448 360 448L280 448C266.7 448 256 437.3 256 424C256 410.7 266.7 400 280 400L304 400L304 336L280 336C266.7 336 256 325.3 256 312C256 298.7 266.7 288 280 288z"/></svg>
                            Thông tin
                        </a>
                        <a href={`/competitions/vnca/${slug}/register`}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M409 337C418.4 327.6 418.4 312.4 409 303.1L265 159C258.1 152.1 247.8 150.1 238.8 153.8C229.8 157.5 224 166.3 224 176L224 256L112 256C85.5 256 64 277.5 64 304L64 336C64 362.5 85.5 384 112 384L224 384L224 464C224 473.7 229.8 482.5 238.8 486.2C247.8 489.9 258.1 487.9 265 481L409 337zM416 480C398.3 480 384 494.3 384 512C384 529.7 398.3 544 416 544L480 544C533 544 576 501 576 448L576 192C576 139 533 96 480 96L416 96C398.3 96 384 110.3 384 128C384 145.7 398.3 160 416 160L480 160C497.7 160 512 174.3 512 192L512 448C512 465.7 497.7 480 480 480L416 480z"/></svg>
                            Đăng ký
                        </a>
                        <a href={`/competitions/vnca/${slug}/registrations`}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M96 192C96 130.1 146.1 80 208 80C269.9 80 320 130.1 320 192C320 253.9 269.9 304 208 304C146.1 304 96 253.9 96 192zM32 528C32 430.8 110.8 352 208 352C305.2 352 384 430.8 384 528L384 534C384 557.2 365.2 576 342 576L74 576C50.8 576 32 557.2 32 534L32 528zM464 128C517 128 560 171 560 224C560 277 517 320 464 320C411 320 368 277 368 224C368 171 411 128 464 128zM464 368C543.5 368 608 432.5 608 512L608 534.4C608 557.4 589.4 576 566.4 576L421.6 576C428.2 563.5 432 549.2 432 534L432 528C432 476.5 414.6 429.1 385.5 391.3C408.1 376.6 435.1 368 464 368z"/></svg>
                            Thí sinh
                        </a>
                    </div>
                </div>
                <div className='comp-page-content'>
                    <div className='comp-tabs'>
                        <a className={tabOpening == 'thong-tin-chung' ? 'ontab' : ''} onClick={() => handleChangeTab('thong-tin-chung')}>Thông tin chung</a>
                        <a className={tabOpening == 'noi-dung' ? 'ontab' : ''} onClick={() => handleChangeTab('noi-dung')}>Nội dung</a>
                        <a className={tabOpening == 'lich-trinh' ? 'ontab' : ''} onClick={() => handleChangeTab('lich-trinh')}>Lịch trình</a>
                        {compData.infoTabs.map((item, index) => (
                            <a className={tabOpening == nameToSlug(item.name, -1) ? 'ontab' : ''} key={index} onClick={() => handleChangeTab(nameToSlug(item.name, -1))}>{item.name}</a>
                        ))}
                    </div>
                    <div className='comp-tab-info'>
                        <div className={tabOpening == 'thong-tin-chung' ? 'open' : 'closed'}>
                            <CompGeneralInfo data={compData} />
                        </div>
                        <div className={tabOpening == 'noi-dung' ? 'open' : 'closed'}>Nội dung</div>
                        <div className={tabOpening == 'lich-trinh' ? 'open' : 'closed'}>Lịch trình</div>
                        {compData.infoTabs.map((item, index) => (
                            <div key={index} className={tabOpening == nameToSlug(item.name, -1) ? 'open' : 'closed'}>
                                <CompInfoTab slug={nameToSlug(item.name, -1)} data={item.info_text} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}