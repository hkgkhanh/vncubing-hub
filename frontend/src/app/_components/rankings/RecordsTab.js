"use client";

import { useState, useEffect } from 'react';
import '@/app/_styles/rankings/default.css';
import { getRecordsRankings } from "@/app/handlers/results";
import RecordsTable from '@/app/_components/rankings/RecordsTable';
import PageNavigation from '@/app/_components/PageNavigation';

export default function RecordsTab() {
    const [rankingData, setRankingData] = useState([]);
    const [participation, setParticipation] = useState(null);
    const [resultIsLoading, setResultIsLoading] = useState(true);
    const [pageData, setPageData] = useState(null);

    useEffect(() => {
        async function handleGetRecordsRankings() {
            const recordsData = await getRecordsRankings(1);
            const pageData = recordsData.pagination;
            const data = recordsData.items;

            console.log(data);

            setResultIsLoading(false);
            setRankingData(data);
            setPageData(pageData);
        }

        handleGetRecordsRankings();

    }, []);

    const handlePageChange = async (newPage) => {
        setResultIsLoading(true);

        const recordsData = await getRecordsRankings(newPage);
        const pageData = recordsData.pagination;
        const data = recordsData.items;

        setResultIsLoading(false);
        setRankingData(data);
        setPageData(pageData);
    };

    return (
        <>
            <RecordsTable data={rankingData} loadingStatus={resultIsLoading} />
            
            { (!resultIsLoading && !(pageData.total == 0)) &&
                <PageNavigation pageData={pageData} onPageChange={handlePageChange} />
            }
        </>
    );
}