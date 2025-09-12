'use client';

import React, { useState, useEffect, Fragment } from 'react';
import { getCompById } from '@/app/handlers/comps';
import { getProcessedRounds, getCompTempResultsByRoundStringId } from '@/app/handlers/comps';
import { calcResult, compareResults } from '@/app/lib/stats';
import '@/app/_styles/competitions/vnca/default.css';
import AppData from "@/data/app.json";
import CompPageSidebar from '@/app/_components/competitions/comp-details/CompPageSidebar';
import LiveResultsProjectorView from '@/app/_components/competitions/comp-details/LiveResultsProjectorView';

export default function CompetitionLivePage({ params }) {
    const { slug } = React.use(params);
    const [compData, setCompData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingRoundResult, setIsLoadingRoundResult] = useState(false);
    const [roundsData, setRoundsData] = useState([]);
    const [eventsData, setEventsData] = useState([]);
    const [resultsData, setResultsData] = useState([]);
    const [selectedRound, setSelectedRound] = useState(null);
    const [showRoundsList, setShowRoundsList] = useState(false);
    const [showProjector, setShowProjector] = useState(false);

    const solvesCountByFormat = {
        "1": 1,
        "2": 2,
        "3": 3,
        "5": 5,
        "a": 5,
        "m": 3
    };

    function findRoundByStringId(data, round_string_id) {
        for (const key in data) {
            const found = data[key].find(r => r.string_id === round_string_id);
            if (found) return found;
        }
        return null;
    }

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
            document.title = `Kết quả trực tiếp của ${data.data.name} | ${AppData.settings.siteName}`;

            let roundsData = await getProcessedRounds(data.data.rounds);
            // console.log(roundsData);
            setRoundsData(roundsData.data);
            setEventsData(roundsData.comp_events);

            const hashPart = window.location.hash;
            if (hashPart) setSelectedRound(hashPart.slice(1));
            else setSelectedRound(roundsData.data[roundsData.comp_events[0].id][0].string_id);

            const roundData = await getCompTempResultsByRoundStringId(hashPart ? hashPart.slice(1) : roundsData.data[roundsData.comp_events[0].id][0].string_id);
            if (!roundData.ok) alert("Lỗi tải trang, vui lòng thử lại.");

            // console.log(roundData.data);
            setResultsData(roundData.data);
            
            setIsLoading(false);
        }
        
        fetchComp();
    }, []);

    useEffect(() => {
        if (!selectedRound) return;

        let isMounted = true;

        async function automaticFetchComp(roundId) {
            if (roundId !== selectedRound) return;

            const roundData = await getCompTempResultsByRoundStringId(roundId);
            if (!roundData.ok) {
                if (isMounted) alert("Lỗi tải trang, vui lòng thử lại.");
                return;
            }

            if (isMounted && roundId === selectedRound) setResultsData(roundData.data);
        }

        setResultsData(null);

        const timeout = setTimeout(() => {
            automaticFetchComp(selectedRound);
            const interval = setInterval(() => automaticFetchComp(selectedRound), 15000);
            return () => clearInterval(interval);
        }, 15000);

        return () => {
            isMounted = false;
            clearTimeout(timeout);
        };
    }, [selectedRound]);

    const handleRoundChange = async (string_id) => {
        setIsLoadingRoundResult(true);
        setShowRoundsList(!showRoundsList);
        setSelectedRound(string_id);
        window.location.hash = string_id;

        const roundData = await getCompTempResultsByRoundStringId(string_id);
        if (!roundData.ok) alert("Lỗi tải trang, vui lòng thử lại.");

        // console.log(roundData.data);
        setResultsData(roundData.data);
        window.scrollTo({ top: 0, behavior: "smooth" })

        setIsLoadingRoundResult(false);
    }

    const handleToggleRoundsList = () => {
        setShowRoundsList(!showRoundsList);
    }

    const handleToggleProjector = () => {
        setShowProjector(!showProjector);
        document.getElementById("footer").classList.toggle('hide');
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

    if (showProjector) return (
        <div className="competition-page">
            <LiveResultsProjectorView
                resultsData={resultsData}
                roundInfo={findRoundByStringId(roundsData, selectedRound)}
                handleShow={handleToggleProjector}
            />
        </div>
    );

    return (
        <div className="competition-page">
            <div className='comp-name'><h1>{compData.name}</h1></div>
            <div className='comp-page-container'>
                <div className='comp-page-nav'>
                    <CompPageSidebar compData={compData} url={'/live'} slug={slug} />
                </div>
                <div className='comp-page-content'>
                    <div className={`create-comp-box live-comp-manage-box`}>
                        <div className={`side-bar ${showRoundsList ? 'show' : 'hide'}`}>
                            {eventsData.map((event, index) => (
                                <Fragment key={index}>
                                <div key={index} className='event-header'>
                                    <img
                                        src={event.is_official
                                            ? `/assets/event_icons/event/${event.id}.svg`
                                            : `/assets/event_icons/unofficial/${event.id}.svg`
                                        }
                                        alt={event.name}
                                        title={event.name}
                                    />
                                    {event.name}
                                </div>
                                {roundsData[event.id].map((round, roundindex) => (
                                    <div key={roundindex} className={`event-round ${round.string_id == selectedRound ? 'round-selected' : ''}`} onClick={() => handleRoundChange(round.string_id)}>{round.name}</div>
                                ))}
                                </Fragment>
                            ))}
                        </div>
                        <div>
                            {isLoadingRoundResult
                                ? <div className='spinner-container'>
                                    <img
                                        src="/ui/spinner.svg"
                                        alt="Loading"
                                        className="spinner"
                                        title="Loading"
                                    />
                                </div>
                                : <div className="table-container">
                                    {(() => {
                                        let round = findRoundByStringId(roundsData, selectedRound);
                                        let solvesCount = solvesCountByFormat[round.format_id];
                                        return (
                                            <>
                                            <div className='round-result-header'>
                                                <div className='round-result-header-left'>
                                                    <svg role="img" aria-label="[title]" onClick={() => handleToggleRoundsList()} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M104 112C90.7 112 80 122.7 80 136L80 184C80 197.3 90.7 208 104 208L152 208C165.3 208 176 197.3 176 184L176 136C176 122.7 165.3 112 152 112L104 112zM256 128C238.3 128 224 142.3 224 160C224 177.7 238.3 192 256 192L544 192C561.7 192 576 177.7 576 160C576 142.3 561.7 128 544 128L256 128zM256 288C238.3 288 224 302.3 224 320C224 337.7 238.3 352 256 352L544 352C561.7 352 576 337.7 576 320C576 302.3 561.7 288 544 288L256 288zM256 448C238.3 448 224 462.3 224 480C224 497.7 238.3 512 256 512L544 512C561.7 512 576 497.7 576 480C576 462.3 561.7 448 544 448L256 448zM80 296L80 344C80 357.3 90.7 368 104 368L152 368C165.3 368 176 357.3 176 344L176 296C176 282.7 165.3 272 152 272L104 272C90.7 272 80 282.7 80 296zM104 432C90.7 432 80 442.7 80 456L80 504C80 517.3 90.7 528 104 528L152 528C165.3 528 176 517.3 176 504L176 456C176 442.7 165.3 432 152 432L104 432z"/><title>Danh sách vòng đấu</title></svg>
                                                    <div>{`${round.EVENTS.name} ${round.name}`}</div>
                                                </div>
                                                <div className='round-result-header-right'>
                                                    <svg role="img" aria-label="[title]" onClick={() => handleToggleProjector()} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M96 160L96 400L544 400L544 160L96 160zM32 160C32 124.7 60.7 96 96 96L544 96C579.3 96 608 124.7 608 160L608 400C608 435.3 579.3 464 544 464L96 464C60.7 464 32 435.3 32 400L32 160zM192 512L448 512C465.7 512 480 526.3 480 544C480 561.7 465.7 576 448 576L192 576C174.3 576 160 561.7 160 544C160 526.3 174.3 512 192 512z"/><title>Trình chiếu</title></svg>
                                                </div>
                                            </div>
                                            <div className='true-table-container'>
                                            <table className='live-result-manage-table'>
                                                <thead>
                                                    <tr>
                                                        <td className='align-right'>#</td>
                                                        <td className='align-left name-col'>Họ tên</td>
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
                                                        <td className='align-right'>
                                                            {(["1", "2", "3", "5"].includes(round.format_id)) ? "Đơn" : "Avg"}
                                                        </td>
                                                        <td className='align-right'>
                                                            {(["1", "2", "3", "5"].includes(round.format_id)) ? "Avg" : "Đơn"}
                                                        </td>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {resultsData.map((c, idx) => (
                                                        <tr key={idx}>
                                                            <td className={`align-right ${((calcResult(c.results, round.format_id).bestString != 'DNF' || calcResult(c.results, round.format_id).avgString != 'DNF') && ((round.next_round != null && ((round.operation_status == 0 && c.rank <= round.to_advance) || (round.operation_status == 1 && c.to_next_round == true))) || (round.next_round == null && (c.rank <= 3 && idx < 3)))) ? 'qualifiable' : ''}`}>{ c.results[0] != 0 ? c.rank : ''}</td>
                                                            <td className='align-left name-col'>{c.PERSONS.name}</td>
                                                            {c.results.slice(0, solvesCount).map((res, rIdx) => (
                                                                <td key={`${selectedRound}-${c.person_id}-${rIdx}`} className='align-right'>
                                                                    {timeValueToString(res)}
                                                                </td>
                                                            ))}
                                                            <td className='align-right bold-text'>
                                                                {(["1", "2", "3", "5"].includes(round.format_id)) ? calcResult(c.results, round.format_id).bestString : calcResult(c.results, round.format_id).avgString}
                                                            </td>
                                                            <td className='align-right'>
                                                                {(["1", "2", "3", "5"].includes(round.format_id)) ? calcResult(c.results, round.format_id).avgString : calcResult(c.results, round.format_id).bestString}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    {resultsData.length === 0 && (
                                                        <tr>
                                                            <td colSpan={solvesCount + 4} className="align-center">
                                                                Không có kết quả.
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                            </div>
                                            </>
                                        );
                                    })()}
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}