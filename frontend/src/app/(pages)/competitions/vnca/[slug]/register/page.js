'use client';

import React, { useState, useEffect } from 'react';
import { getCompById } from '@/app/handlers/comps';
import '@/app/_styles/competitions/vnca/default.css';
import AppData from "@/data/app.json";
import { useAuth } from "@/app/context/AuthContext";
import CompRegisterForm from '@/app/_components/competitions/comp-details/CompRegisterForm';
import CompPageSidebar from '@/app/_components/competitions/comp-details/CompPageSidebar';

export default function CompetitionRegisterPage({ params }) {
    const { slug } = React.use(params);
    const [compData, setCompData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { isLoggedInPerson, isLoggedInOrganiser } = useAuth();

    useEffect(() => {
        async function fetchComp() {
            setIsLoading(true);
            const compId = parseInt(slug.split("-").at(-1));

            const data = await getCompById(compId);

            if (!data.ok) alert("Tải trang thất bại, vui lòng thử lại.");

            console.log(data.data);
            setCompData(data.data);
            document.title = `${data.data.name} | ${AppData.settings.siteName}`;
            
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
                    <CompPageSidebar url={'/register'} slug={slug} />
                </div>
                <div className='comp-page-content'>
                    <CompRegisterForm compData={compData} isLoggedInPerson={isLoggedInPerson} isLoggedInOrganiser={isLoggedInOrganiser} />
                </div>
            </div>
        </div>
    );
}