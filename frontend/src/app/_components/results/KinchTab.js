"use client";

import { useState, useEffect } from 'react';
import '@/app/_styles/results/default.css';
import { getKinchRankings } from "@/app/handlers/results";
import KinchTable from '@/app/_components/results/KinchTable';
import PageNavigation from '@/app/_components/PageNavigation';

export default function KinchTab() {
    const [rankingData, setRankingData] = useState([]);
    const [participation, setParticipation] = useState(null);
    const [resultIsLoading, setResultIsLoading] = useState(true);
    const [pageData, setPageData] = useState(null);

    useEffect(() => {
        async function handleGetKinchRankings() {
            const kinchData = await getKinchRankings(1);
            const pageData = kinchData.pagination;
            const data = kinchData.items;

            setResultIsLoading(false);
            setRankingData(data);
            setPageData(pageData);
            setParticipation(participation);
        }

        handleGetKinchRankings();

    }, []);

    const handlePageChange = async (newPage) => {
        setResultIsLoading(true);

        const sorData = await getKinchRankings(newPage);
        const pageData = await sorData.pagination;
        const data = await sorData.items;

        setResultIsLoading(false);
        setRankingData(data);
        setPageData(pageData);
    };

    return (
        <>
            <KinchTable data={rankingData} loadingStatus={resultIsLoading} />
            
            { !resultIsLoading &&
                <PageNavigation pageData={pageData} onPageChange={handlePageChange} />
            }
        </>
    );
}