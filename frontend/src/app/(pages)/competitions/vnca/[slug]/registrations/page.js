'use client';

import React, { useState, useEffect } from 'react';
import { getCompById } from '@/app/handlers/comps';
import '@/app/_styles/competitions/vnca/default.css';
import AppData from "@/data/app.json";
import CompRegistrationsList from '@/app/_components/competitions/comp-details/CompRegistrationsList';
import CompPageSidebar from '@/app/_components/competitions/comp-details/CompPageSidebar';

export default function CompetitionRegistrationsPage({ params }) {
    const { slug } = React.use(params);
    const [compData, setCompData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchComp() {
            setIsLoading(true);
            const compId = parseInt(slug.split("-").at(-1));

            const data = await getCompById(compId);

            if (!data.ok) alert("Tải trang thất bại, vui lòng thử lại.");

            // console.log(data.data);
            setCompData(data.data);
            document.title = `Đơn đăng ký cho ${data.data.name} | ${AppData.settings.siteName}`;
            
            setIsLoading(false);
        }
        
        fetchComp();
    }, []);

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
                    <CompPageSidebar compData={compData} url={'/registrations'} slug={slug} />
                </div>
                <div className='comp-page-content'>
                    <CompRegistrationsList compData={compData} />
                </div>
            </div>
        </div>
    );
}