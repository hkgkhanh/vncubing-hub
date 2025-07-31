"use client";

import { useState, useEffect } from 'react';
import '@/app/_styles/results/default.css';
import { getSorRankings } from "@/app/handlers/results";
import SorTable from '@/app/_components/results/SorTable';
import PageNavigation from '@/app/_components/PageNavigation';
import resultFilters from '@/data/results-filter.json';

export default function SorTab() {
    const [rankingData, setRankingData] = useState([]);
    const [participation, setParticipation] = useState(null);
    const [resultIsLoading, setResultIsLoading] = useState(true);
    const [pageData, setPageData] = useState(null);
    const [filters, setFilters] = useState({
        category: 'all',
        type: 'single'
    });

    const [tempFilters, setTempFilters] = useState({
        category: 'all',
        type: 'single'
    });

    const sorFilters = resultFilters.sor_filter;
    const sorCategoriesFilters = sorFilters.categories;
    const sorTypeFilters = sorFilters.type;

    useEffect(() => {
        async function handleGetSorRankings() {
            const sorData = await getSorRankings(tempFilters.category, tempFilters.type, 1);
            const pageData = sorData.data.pagination;
            const data = sorData.data.items;
            const participation = sorData.participation;

            setResultIsLoading(false);
            setRankingData(data);
            setPageData(pageData);
            setParticipation(participation);
        }

        handleGetSorRankings();

    }, []);

    const handleChangeFilter = (e) => {
        const { name, value } = e.target;

        setTempFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmitFilter = async (e) => {
        e.preventDefault();

        setFilters({ ...tempFilters }); // still good to update the state

        setResultIsLoading(true);

        const sorData = await getSorRankings(tempFilters.category, tempFilters.type, 1);
        const pageData = sorData.data.pagination;
        const data = sorData.data.items;
        const participation = sorData.participation;

        setResultIsLoading(false);
        setRankingData(data);
        setPageData(pageData);
        setParticipation(participation);
    };

    const handlePageChange = async (newPage) => {
        setResultIsLoading(true);

        const sorData = await getSorRankings(tempFilters.category, tempFilters.type, newPage);
        const pageData = await sorData.data.pagination;
        const data = await sorData.data.items;
        const participation = sorData.participation;

        setResultIsLoading(false);
        setRankingData(data);
        setPageData(pageData);
        setParticipation(participation);
    };

    return (
        <>
            <div className='wca-filters'>
                <form onSubmit={handleSubmitFilter}>
                    <label>
                        <span>Nội dung</span>
                        <select name="category" value={tempFilters.category} onChange={handleChangeFilter}>
                            {sorCategoriesFilters.map((item, index) => (
                                <option value={item.id} key={index}>{item.name_vi}</option>
                            ))}
                        </select>
                    </label>

                    <label>
                        <span>Thành tích</span>
                        <select name="type" value={tempFilters.type} onChange={handleChangeFilter}>
                            {sorTypeFilters.map((item, index) => (
                                <option value={item.id} key={index}>{item.name_vi}</option>
                            ))}
                        </select>
                    </label>
                    

                    <button type="submit" disabled={resultIsLoading}>Xác nhận</button>
                </form>
            </div>

            <SorTable data={rankingData} participation={participation} category={filters.category} events={sorCategoriesFilters[sorCategoriesFilters.findIndex(p => p.id == filters.category)].events} type={filters.type} loadingStatus={resultIsLoading} />
            
            { !resultIsLoading &&
                <PageNavigation pageData={pageData} onPageChange={handlePageChange} />
            }
        </>
    );
}