'use client';

import React, { useState, useEffect, Fragment } from 'react';
import { getCompById } from '@/app/handlers/comps';
import { getRoundsList } from '@/app/handlers/live-comp-management';
import { calcResult, compareResults } from '@/app/lib/stats';
import '@/app/_styles/competitions/vnca/default.css';
import AppData from "@/data/app.json";
import CompPageSidebar from '@/app/_components/competitions/comp-details/CompPageSidebar';

export default function CompetitionLivePage({ params }) {
    const { slug } = React.use(params);
    const [compData, setCompData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [roundsData, setRoundsData] = useState([]);
    const [eventsData, setEventsData] = useState([]);
    const [selectedRound, setSelectedRound] = useState(null);

    const solvesCountByFormat = {
        "1": 1,
        "2": 2,
        "3": 3,
        "5": 5,
        "a": 5,
        "m": 3
    };

    function timeValueToString(time_value) {
        if (time_value == -1) return "DNF";
        if (time_value == -2) return "DNS";

        let result = '';
        if (time_value == null || isNaN(time_value) || time_value == 0) return '';

        let minutes = Math.floor(time_value / 6000); // 6000 cs = 60s = 1m
        let seconds = Math.floor((time_value % 6000) / 100);
        let centis  = time_value % 100;

        if (minutes > 0) {
            result += `${minutes}:${seconds.toString().padStart(2, "0")}.${centis.toString().padStart(2, "0")}`;
        } else {
            result += `${seconds}.${centis.toString().padStart(2, "0")}`;
        }

        return result;
    }

    useEffect(() => {
        async function fetchComp() {
            setIsLoading(true);
            const compId = parseInt(slug.split("-").at(-1));
            const data = await getCompById(compId);
            if (!data.ok) alert("Tải trang thất bại, vui lòng thử lại.");

            // console.log(data.data);
            setCompData(data.data);
            document.title = `Trực tiếp ${data.data.name} | ${AppData.settings.siteName}`;

            let roundsData = await getRoundsList(compId);
            if (!data.ok) alert("Tải trang thất bại, vui lòng thử lại.");
            // console.log(data);
            setRoundsData(roundsData.data);
            setEventsData(roundsData.comp_events);

            const hashPart = window.location.hash;
            if (hashPart) setSelectedRound(hashPart.slice(1));
            else setSelectedRound(roundsData.data[0].string_id);
            
            setIsLoading(false);
        }
        
        fetchComp();
    }, []);

    const handleRoundChange = (string_id) => {
        setSelectedRound(string_id);
        window.location.hash = string_id;
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
                    {/* <CompPageSidebar compData={compData} url={'/live'} slug={slug} /> */}
                </div>
                <div className='comp-page-content'>
                    <div className={`create-comp-box live-comp-manage-box`}>
                        <div className="side-bar">
                            {eventsData.map((event, index) => (
                                <Fragment key={index}>
                                <div key={index} className='event-header'>
                                    <img
                                        src={event.is_official
                                            ? `/assets/event_icons/event/${event.event_id}.svg`
                                            : `/assets/event_icons/unofficial/${event.event_id}.svg`
                                        }
                                        alt={event.name}
                                        title={event.name}
                                    />
                                    {event.name}
                                </div>
                                {roundsData.filter(round => round.event_id === event.event_id).map((round, roundindex) => (
                                    <div key={roundindex} className={`event-round ${round.string_id == selectedRound ? 'round-selected' : ''}`} onClick={() => handleRoundChange(round.string_id)}>{round.name}</div>
                                ))}
                                </Fragment>
                            ))}
                        </div>
                        <div>
                            <div className="table-container">
                                {(() => {
                                    const round = roundsData.find(r => r.string_id === selectedRound);
                                    if (!round) return <div>Không tìm thấy vòng đấu</div>;
    
                                    const solvesCount = solvesCountByFormat[round.format_id];
    
                                    const filteredCompetitors = round.competitors.sort((a, b) =>
                                        compareResults(a, b, r.format_id)
                                    );
    
                                    return (
                                        <table className='live-result-manage-table'>
                                            <thead>
                                                <tr>
                                                    <td className='align-left'>#</td>
                                                    <td className='align-left'>Họ tên</td>
                                                    <td className='align-right'>1</td>
                                                    {!(["1"].includes(round.format_id)) && (
                                                            <td className='align-right'>2</td>
                                                    )}
                                                    {!(["1", "2"].includes(round.format_id)) && (
                                                            <td className='align-right'>3</td>
                                                    )}
                                                    {!(["1", "2", "3", "m"].includes(round.format_id)) && (
                                                        <>
                                                            <td className='align-right'>4</td>
                                                            <td className='align-right'>5</td>
                                                        </>
                                                    )}
                                                    <td className='align-right'>Đơn</td>
                                                    <td className='align-right'>Avg</td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredCompetitors.map((c, idx) => (
                                                    <tr key={idx}>
                                                        <td className='align-left'>{idx + 1}</td>
                                                        <td className='align-left'>{c.person_name}</td>
                                                        {c.results.slice(0, solvesCount).map((res, rIdx) => (
                                                            <td key={`${selectedRound}-${c.person_id}-${rIdx}`} className='align-right'>
                                                                {timeValueToString(res)}
                                                            </td>
                                                        ))}
                                                        <td className='align-right'>{calcResult(c.results, round.format_id).bestString}</td>
                                                        <td className='align-right'>{calcResult(c.results, round.format_id).avgString}</td>
                                                    </tr>
                                                ))}
                                                {filteredCompetitors.length === 0 && (
                                                    <tr>
                                                        <td colSpan={solvesCount + 4} className="align-center">
                                                            Không có kết quả.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}