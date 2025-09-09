'use client';

import React, { useState, useEffect } from 'react';
import { getCompById } from '@/app/handlers/comps';
import '@/app/_styles/competitions/vnca/default.css';
import AppData from "@/data/app.json";
import { nameToSlug } from '@/app/utils/codeGen';
import CompInfoTab from '@/app/_components/competitions/comp-details/CompInfoTab';
import CompGeneralInfo from '@/app/_components/competitions/comp-details/CompGeneralInfo';
import CompEventsTab from '@/app/_components/competitions/comp-details/CompEventsTab';
import CompScheduleTab from '@/app/_components/competitions/comp-details/CompScheduleTab';
import CompPageSidebar from '@/app/_components/competitions/comp-details/CompPageSidebar';

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
        if (slug == tabOpening) return;

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
                    <CompPageSidebar url={''} slug={slug} />
                </div>
                <div className='comp-page-content'>
                    <div className='comp-tabs'>
                        <a className={tabOpening == 'thong-tin-chung' ? 'ontab' : 'offtab'} onClick={() => handleChangeTab('thong-tin-chung')}>Thông tin chung</a>
                        <a className={tabOpening == 'noi-dung' ? 'ontab' : 'offtab'} onClick={() => handleChangeTab('noi-dung')}>Nội dung</a>
                        <a className={tabOpening == 'lich-trinh' ? 'ontab' : 'offtab'} onClick={() => handleChangeTab('lich-trinh')}>Lịch trình</a>
                        {compData.infoTabs.map((item, index) => (
                            <a className={tabOpening == nameToSlug(item.name, -1) ? 'ontab' : 'offtab'} key={index} onClick={() => handleChangeTab(nameToSlug(item.name, -1))}>{item.name}</a>
                        ))}
                    </div>
                    <div className='comp-tab-info'>
                        <div className={tabOpening == 'thong-tin-chung' ? 'open' : 'closed'}>
                            <CompGeneralInfo data={compData} />
                        </div>
                        <div className={tabOpening == 'noi-dung' ? 'open' : 'closed'}>
                            <CompEventsTab data={compData} />
                        </div>
                        <div className={tabOpening == 'lich-trinh' ? 'open' : 'closed'}>
                            <CompScheduleTab data={compData} />
                        </div>
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