'use client';

import React, { useState, useEffect } from 'react';
import { getCompById } from '@/app/handlers/comps';
import '@/app/_styles/competitions/default.css';

export default function CompetitionPage({ params }) {
    const { slug } = React.use(params);
    const [compData, setCompData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchComp() {
            setIsLoading(true);
            const compId = parseInt(slug.split("-").at(-1));

            const data = await getCompById(compId);

            if (!data.ok) alert("Tải trang thất bại, vui lòng thử lại.");

            console.log(data.data[0]);
            setCompData(data.data[0]);
            setIsLoading(false);
        }
        
        fetchComp();
    }, [slug]);

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

        </div>
    );
}