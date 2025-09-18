"use client";

import { useState, useEffect } from 'react';
import '@/app/_styles/rankings/default.css';

export default function RankingTable({ data, event, type, loadingStatus }) {
    const [navbarHeight, setNavbarHeight] = useState(0);

    // useEffect(() => {
    // const navbarElement = document.getElementById("navbar");
    // if (navbarElement) {
    //     setNavbarHeight(navbarElement.offsetHeight);

    //     const resizeObserver = new ResizeObserver(() => {
    //         setNavbarHeight(navbarElement.offsetHeight);
    //     });

    //     resizeObserver.observe(navbarElement);

    //     return () => resizeObserver.disconnect();
    // }
    // }, []);

    function formatResult(event, result, isInDetails) {
        if (result == -1) return "DNF";
        if (result == -2) return "DNS";
        if (result == 0) return "";

        if (event == "333mbf") {
            const str = result.toString().padStart(9, '0'); // Ensure 9 digits
            const DD = parseInt(str.slice(0, 2), 10);
            const TTTTT = parseInt(str.slice(2, 7), 10);
            const MM = parseInt(str.slice(7, 9), 10);

            const difference = 99 - DD;
            const timeInSeconds = TTTTT === 99999 ? null : TTTTT;
            const missed = MM;
            const solved = difference + missed;
            const attempted = solved + missed;

            const formattedTime = timeInSeconds === null
            ? "unknown"
            : `${Math.floor(timeInSeconds / 60)}:${String(timeInSeconds % 60).padStart(2, '0')}`;

            return `${solved}/${attempted} ${formattedTime}`;
        }

        if (event == "333fm" && !isInDetails) {
            return (result / 100).toFixed(2);
        }

        if (event == "333fm" && isInDetails) {
            return `${result}`;
        }

        const timeInSeconds = result / 100;
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;

        const secondsStr = seconds.toFixed(2).padStart(minutes > 0 ? 5 : 0, '0');

        return minutes > 0
            ? `${minutes}:${secondsStr}`
            : `${secondsStr}`;
    }

    function SolvesColumns({ solves, event }) {
        let bestIndex = 0;
        let worstIndex = 4;
        let best = Number.MAX_SAFE_INTEGER;
        let worst = -2;

        for (let i = 0; i < solves.length; i++) {
            if (solves[i] > 0 && solves[i] < best) {
                best = solves[i];
                bestIndex = i;
            }
        }

        for (let i = solves.length - 1; i >= 0; i--) {
            if (solves[i] < 0) {
                worst = Number.MAX_SAFE_INTEGER;
                worstIndex = i;
                continue;
            }
            if (solves[i] > worst) {
                worst = solves[i];
                worstIndex = i;
            }
        }

        if (solves.filter(s => s != 0).length < 4) {
            bestIndex = -1;
            worstIndex = -1;
        }

        return (
            <>
            {Array.from({ length: solves.filter(s => s != 0).length }).map((_, i) => (
                <td key={i} className={`text-right ${i == bestIndex ? 'best-in-avg' : ''} ${(i ==  worstIndex || solves[i] < 0) ? 'worst-in-avg' : ''}`}>
                    {formatResult(event, solves[i], true) ?? ""}
                </td>
            ))}
            </>
        )
    }

    let rankedData = [];
    if (!loadingStatus) {
        let currentRank = 1;
        let lastResult = null;
        let actualIndex = 1;

        if (type == "average") {
            data.forEach((item) => {
                if (item.average !== lastResult) {
                    currentRank = actualIndex;
                    lastResult = item.average;
                }
                rankedData.push({ ...item, actualRank: currentRank });
                actualIndex++;
            });
        } else if (type == "single") {
            data.forEach((item) => {
                if (item.best !== lastResult) {
                    currentRank = actualIndex;
                    lastResult = item.best;
                }
                rankedData.push({ ...item, actualRank: currentRank });
                actualIndex++;
            });
        }
    }

    if (!loadingStatus && data.length == 0) {
        return (
            <div className="no-result">
                Không có kết quả.
            </div>
        );
    }

    return (
        <div className="ranking-table" style={{ '--navbar-offset': `${navbarHeight}px` }}>
            {loadingStatus ? (
                <div className='spinner-container'>
                    <img
                        src="/ui/spinner.svg"
                        alt="Loading"
                        className="spinner"
                        title="Loading"
                    />
                </div>
                
            ) : type === "average" ? (
                <table>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Họ và tên</th>
                        <th>Kết quả</th>
                        <th>Cuộc thi</th>
                        <th colSpan={5} className='text-center'>Lượt giải</th>
                    </tr>
                    </thead>
                    <tbody>
                        {rankedData.map((item, index) => (
                            <tr key={index}>
                            <td>{item.actualRank}</td>
                            <td className='ext-link'><a href={`https://www.worldcubeassociation.org/persons/${item.personId}`} target='_blank'>{item.personName}</a></td>
                            <td>{formatResult(event, item.average, false)}</td>
                            <td className='ext-link'><a href={`https://www.worldcubeassociation.org/competitions/${item.competitionId}`} target='_blank'>{item.competitionName}</a></td>
                            {/* <td>
                                {formatDetails(event, item.solves, true)}
                            </td> */}
                            <SolvesColumns solves={item.solves} event={event} />
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <table>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Họ và tên</th>
                        <th>Kết quả</th>
                        <th>Cuộc thi</th>
                    </tr>
                    </thead>
                    <tbody>
                        {rankedData.map((item, index) => (
                            <tr key={index}>
                            <td>{item.actualRank}</td>
                            <td className='ext-link'><a href={`https://www.worldcubeassociation.org/persons/${item.personId}`} target='_blank'>{item.personName}</a></td>
                            <td>{formatResult(event, item.best, true)}</td>
                            <td className='ext-link'><a href={`https://www.worldcubeassociation.org/competitions/${item.competitionId}`} target='_blank'>{item.competitionName}</a></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}