"use client";

import { useState, useEffect } from 'react';
import '@/app/_styles/rankings/default.css';
import { getVncaRankings, getVncaEvents } from "@/app/handlers/results";
import VncaRankingTable from '@/app/_components/rankings/VncaRankingTable';
import resultFilters from '@/data/results-filter.json';

export default function VncaRankingTab() {
    const [rankingData, setRankingData] = useState([]);
    const [resultIsLoading, setResultIsLoading] = useState(true);
    const [eventsFilter, setEventsFilter] = useState([]);
    const [filters, setFilters] = useState({
        event: '333',
        type: 'single',
        person_or_result: 'person'
    });

    const [tempFilters, setTempFilters] = useState({
        event: '333',
        type: 'single',
        person_or_result: 'person'
    });

    const wcaFilters = resultFilters.wca_filter;
    // const wcaEventsFilters = wcaFilters.event;
    const wcaTypeFilters = wcaFilters.type;
    const wcaShowFilters = wcaFilters.show;

    useEffect(() => {
        async function handleGetWcaRankings() {
            const eventsData = await getVncaEvents();
            const data = await getVncaRankings(filters.event, filters.type, filters.person_or_result);

            setEventsFilter(eventsData);
            setRankingData(data);
            setResultIsLoading(false);
        }

        handleGetWcaRankings();

    }, []);

    const handleChangeFilter = (e) => {
        const { name, value } = e.target;

        // If event is being changed and it's 333mbf, force type to "single"
        if (name === "event" && value === "333mbf") {
            setTempFilters((prev) => ({
                ...prev,
                event: value,
                type: "single", // force override
            }));
        } else {
            setTempFilters((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmitFilter = async (e) => {
        e.preventDefault();

        setFilters({ ...tempFilters }); // still good to update the state

        setResultIsLoading(true);

        const data = await getVncaRankings(
            tempFilters.event,
            tempFilters.type,
            tempFilters.person_or_result
        );

        setResultIsLoading(false);
        setRankingData(data);
    };

    return (
        <>
            <div className='wca-filters'>
                <form onSubmit={handleSubmitFilter}>
                    <label>
                        <span>Nội dung</span>
                        <select name="event" value={tempFilters.event} onChange={handleChangeFilter}>
                            {eventsFilter.map((item, index) => (
                                <option value={item.id} key={index}>{item.name}</option>
                            ))}
                        </select>
                    </label>

                    <label>
                        <span>Thành tích</span>
                        <select name="type" value={tempFilters.type} onChange={handleChangeFilter}>
                            {(tempFilters.event === "333mbf"
                                ? wcaTypeFilters.filter(item => item.id === "single")
                                : wcaTypeFilters
                            ).map((item, index) => (
                                <option value={item.id} key={index}>{item.name_vi}</option>
                            ))}
                        </select>
                    </label>

                    <label>
                        <span>Hiển thị</span>
                        <select name="person_or_result" value={tempFilters.person_or_result} onChange={handleChangeFilter}>
                            {wcaShowFilters.map((item, index) => (
                                <option value={item.id} key={index}>{item.name_vi}</option>
                            ))}
                        </select>
                    </label>
                    

                    <button type="submit" disabled={resultIsLoading}>Xác nhận</button>
                </form>
            </div>
            <VncaRankingTable data={rankingData} event={filters.event} type={filters.type} loadingStatus={resultIsLoading} />
        </>
    );
}