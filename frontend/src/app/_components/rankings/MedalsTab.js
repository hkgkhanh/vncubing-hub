"use client";

import { useState, useEffect } from 'react';
import '@/app/_styles/rankings/default.css';
import { getMedalsRankings } from "@/app/handlers/results";
import MedalsTable from '@/app/_components/rankings/MedalsTable';
import PageNavigation from '@/app/_components/PageNavigation';

export default function MedalsTab() {
    const [rankingData, setRankingData] = useState([]);
    const [participation, setParticipation] = useState(null);
    const [resultIsLoading, setResultIsLoading] = useState(true);
    const [pageData, setPageData] = useState(null);

    useEffect(() => {
        async function handleGetMedalsRankings() {
            const medalsData = await getMedalsRankings(1);
            const pageData = medalsData.pagination;
            const data = medalsData.items;

            setResultIsLoading(false);
            setRankingData(data);
            setPageData(pageData);
            setParticipation(participation);
        }

        handleGetMedalsRankings();

    }, []);

    const handlePageChange = async (newPage) => {
        setResultIsLoading(true);

        const medalsData = await getMedalsRankings(newPage);
        const pageData = await medalsData.pagination;
        const data = await medalsData.items;

        setResultIsLoading(false);
        setRankingData(data);
        setPageData(pageData);
    };

    return (
        <>
            <MedalsTable data={rankingData} loadingStatus={resultIsLoading} />
            
            { (!resultIsLoading && !(pageData.total == 0)) &&
                <PageNavigation pageData={pageData} onPageChange={handlePageChange} />
            }
        </>
    );
}