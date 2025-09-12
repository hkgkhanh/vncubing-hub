"use client";

import React, { useEffect, useState, useRef } from "react";
import { calcResult } from "@/app/lib/stats";
import "@/app/_styles/projector-view.css";
import "@/app/globals.css";

export default function LiveResultsProjectorView({ resultsData, roundInfo, handleShow }) {
    const [currentRound, setCurrentRound] = useState(roundInfo);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const resultsToShow = resultsData.filter(c => c.results[0] != 0);

    const solvesCountByFormat = {
        "1": 1,
        "2": 2,
        "3": 3,
        "5": 5,
        "a": 5,
        "m": 3
    };
    const solvesCount = solvesCountByFormat[roundInfo.format_id];

    const containerRef = useRef(null);
    const rowRef = useRef(null);
    const intervalTime = 10000; // ms per page

    // Reset page when switching round
    useEffect(() => {
        setCurrentRound(roundInfo);
        setPage(0);
    }, [roundInfo]);

    // Auto paginate
    useEffect(() => {
        if (!resultsToShow || resultsToShow.length <= pageSize) return;

        const interval = setInterval(() => {
            setPage((prev) => {
                const maxPage = Math.ceil(resultsToShow.length / pageSize) - 1;
                return prev >= maxPage ? 0 : prev + 1;
            });
        }, intervalTime);

        return () => clearInterval(interval);
    }, [resultsToShow, pageSize]);

    // Calculate pageSize dynamically
    useEffect(() => {
        function calcPageSize() {
            if (containerRef.current && rowRef.current) {
                const containerHeight = containerRef.current.offsetHeight;
                const rowHeight = rowRef.current.offsetHeight;
                const newPageSize = Math.max(
                    1,
                    Math.floor(containerHeight / rowHeight) - 1
                );
                setPageSize(newPageSize);
                setPage(0); // reset to first page
            }
        }

        calcPageSize();
        window.addEventListener("resize", calcPageSize);
        return () => window.removeEventListener("resize", calcPageSize);
    }, []);

    if (!resultsData || resultsData.length === 0) {
        return <div className="projector">
            <div className='spinner-container'>
                <img
                    src="/ui/spinner.svg"
                    alt="Loading"
                    className="spinner"
                    title="Loading"
                />
            </div>
        </div>;
    }

    const startIndex = page * pageSize;
    const pageResults = resultsToShow.slice(startIndex, startIndex + pageSize);

    return (
        <div className="projector">
            <div className="projector-header">
                <div className="projector-title">
                    {currentRound?.EVENTS?.name || "Sự kiện"} - {currentRound?.name}
                </div>
                <div className="projector-close">
                    <svg role="img" aria-label="[title]" onClick={() => handleShow(false)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z"/><title>Đóng trình chiếu</title></svg>
                </div>
            </div>

            <div ref={containerRef} className="projector-table-container">
                <table className="projector-table">
                    <thead>
                        <tr>
                            <td className='align-right rank-col'>#</td>
                            <td className='align-left name-col'>Họ tên</td>
                            <td className='align-right'>1</td>
                            {!(["1"].includes(currentRound.format_id)) && (
                                    <td className='align-right'>2</td>
                            )}
                            {!(["1", "2"].includes(currentRound.format_id)) && (
                                    <td className='align-right'>3</td>
                            )}
                            {!(["1", "2", "3", "m"].includes(currentRound.format_id)) && (
                                <>
                                    <td className='align-right'>4</td>
                                    <td className='align-right'>5</td>
                                </>
                            )}
                            <td className='align-right'>
                                {(["1", "2", "3", "5"].includes(currentRound.format_id)) ? "Đơn" : "Avg"}
                            </td>
                            <td className='align-right'>
                                {(["1", "2", "3", "5"].includes(currentRound.format_id)) ? "Avg" : "Đơn"}
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        {pageResults.map((r, i) => (
                            <tr
                                key={r.person_id}
                                ref={i === 0 ? rowRef : null} // measure first row
                            >
                                <td className={`align-right rank-col ${((calcResult(r.results, currentRound.format_id).bestString != 'DNF' || calcResult(r.results, currentRound.format_id).avgString != 'DNF') && ((currentRound.next_round != null && ((currentRound.operation_status == 0 && c.rank <= currentRound.to_advance) || (currentRound.operation_status == 1 && r.to_next_round == true))) || (currentRound.next_round == null && (r.rank <= 3 && i < 3)))) ? 'highlight-row' : ''}`}>
                                    {r.rank}
                                </td>
                                <td>{r.PERSONS.name}</td>
                                {r.results.slice(0, solvesCount).map((res, rIdx) => (
                                    <td key={`${currentRound.string_id}-${r.person_id}-${rIdx}`} className='align-right'>
                                        {timeValueToString(res)}
                                    </td>
                                ))}
                                <td className='align-right bold-text'>
                                    {(["1", "2", "3", "5"].includes(currentRound.format_id)) ? timeValueToString(r.best) : timeValueToString(r.avg)}
                                </td>
                                <td className='align-right'>
                                    {(["1", "2", "3", "5"].includes(currentRound.format_id)) ? timeValueToString(r.avg) : timeValueToString(r.best)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
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