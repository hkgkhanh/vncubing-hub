'use client';

import React, { useState, useEffect } from 'react';
import AppData from "@/data/app.json";
import { nameToSlug } from '@/app/utils/codeGen';
import { getPersonVncaInfoById, getPersonWcaInfoById } from '@/app/handlers/person';
import { getVncaEvents } from '@/app/handlers/results';
import '@/app/_styles/persons/default.css';

export default function PersonPage({ params }) {
    const { slug } = React.use(params);
    const [personData, setPersonData] = useState(null);
    const [personWcaData, setPersonWcaData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasWcaid, setHasWcaid] = useState(false);
    const [wcaCompletedSolves, setWcaCompletedSolves] = useState(0);
    const [events, setEvents] = useState([]);
    const [eventsObject, setEventsObject] = useState(null);
    const [tab, setTab] = useState(null);
    const [tabEvent, setTabEvent] = useState(null);

    const genders = {
        'm': 'Nam',
        'f': 'Nữ',
        'o': 'Khác',
        'u': 'Không xác định'
    };

    const rounds = {
        'Final': 'Chung kết',
        'Semi Final': 'Bán kết',
        'First round': 'Vòng 1',
        'Second round': 'Vòng 2',
        'Third round': 'Vòng 3'
    };

    const solveCountByFormatId = {
        '1': 1,
        '2': 2,
        '3': 3,
        '5': 5,
        'a': 5,
        'm': 3,
        'Best of 1': 1,
        'Best of 2': 2,
        'Best of 3': 3,
        'Best of 5': 5,
        'Average of 5': 5,
        'Mean of 3': 3
    }

    function countCompletedSolves(results, compIds) {
        let count = 0;
        for (let i = 0; i < compIds.length; i++) {
            let compId = compIds[i];
            let eventIds = Object.keys(results[compId]);
            for (let j = 0; j < eventIds.length; j++) {
                let rounds = results[compId][eventIds[j]];
                for (let k = 0; k < rounds.length; k++) count += rounds[k].solves.filter(s => s > 0).length;
            }
        }
        return count;
    }

    function formatResult(event, result, isInDetails) {
        if (result == -1) return "DNF";
        if (result == -2) return "DNS";

        if (result == null || isNaN(result) || result == 0) return '';

        if (event == "333mbf") {
            const str = result.toString().padStart(9, '0'); // ensure 9 digits
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

        if (['333fm', '333lfm'].includes(event) && !isInDetails) {
            return (result / 100).toFixed(2);
        }

        if (['333fm', '333lfm'].includes(event) && isInDetails) {
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

    useEffect(() => {
        async function fetchPerson() {
            setIsLoading(true);
            const personId = parseInt(slug.split("-").at(-1));

            const data = await getPersonVncaInfoById(personId);

            if (!data.ok) alert("Tải trang thất bại, vui lòng thử lại.");

            // console.log(data.data);
            document.title = `${data.data.name} | ${AppData.settings.siteName}`;
            setPersonData(data.data);
            setHasWcaid(data.data.wcaid != null);

            let wcaData;
            if (data.data.wcaid != null) {
                wcaData = await getPersonWcaInfoById(data.data.wcaid);
                if (!wcaData.ok) alert("Tải trang thất bại, vui lòng thử lại.");

                setPersonWcaData(wcaData.data);
                setWcaCompletedSolves(countCompletedSolves(wcaData.data.results, wcaData.data.competitionIds));
            }

            setTab(data.data.wcaid == null ? 'vnca' : 'wca');
            setTabEvent(data.data.wcaid == null
                ? (data.data.rank.singles.length == 0 ? null : data.data.rank.singles[0].event_id)
                : (wcaData.data.rank.singles.length == 0 ? null : wcaData.data.rank.singles[0].eventId)
            );

            const eventsData = await getVncaEvents();
            setEvents(eventsData);
            setEventsObject(eventsData.reduce((acc, event) => {
                acc[event.id] = event;
                return acc;
            }, {}));

            // const hashPart = window.location.hash;
            // if (hashPart) setTabOpening(hashPart.slice(1));
            
            setIsLoading(false);
        }
        
        fetchPerson();
    }, []);

    function SolvesColumns({ solves, format, maxSolveCount }) {
        if (['1', '2', '3', 'm', 'Best of 1', 'Best of 2', 'Best of 3', 'Mean of 3'].includes(format))
            return (
                <>
                {Array.from({ length: maxSolveCount }).map((_, i) => (
                    <td key={i} className="text-right">
                        {formatResult(tabEvent, solves[i], true) ?? ""}
                    </td>
                ))}
                </>
            )

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

        return (
            <>
            {Array.from({ length: maxSolveCount }).map((_, i) => (
                <td key={i} className={`text-right ${i == bestIndex ? 'best-in-avg' : ''} ${(i ==  worstIndex || solves[i] < 0) ? 'worst-in-avg' : ''}`}>
                    {formatResult(tabEvent, solves[i], true) ?? ""}
                </td>
            ))}
            </>
        )
    }

    const handleChangeTab = (tab) => {
        setTab(tab);
        setTabEvent(tab == 'vnca'
            ? (personData.rank.singles.length == 0 ? null : personData.rank.singles[0].event_id)
            : (personWcaData.rank.singles.length == 0 ? null : personWcaData.rank.singles[0].eventId)
        );
    }

    const handleChangeTabEvent = (tabEvent) => {
        setTabEvent(tabEvent);
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
        <div className="person-page">
            <div className='name-container'>{personData.name}</div>
            <div className='basic-info-container'>
                <div className='basic-info-child-container vncaid-info'>
                    <div className='basic-info-title'>VNCA ID</div>
                    <div className='basic-info-content'>{personData.id}</div>
                </div>
                {hasWcaid &&
                    <div className='basic-info-child-container wcaid-info'>
                        <div className='basic-info-title'>WCA ID</div>
                        <div className='basic-info-content'><a href={`https://www.worldcubeassociation.org/persons/${personData.wcaid}`} target='_blank'>{personData.wcaid}</a></div>
                    </div>
                }
                <div className='basic-info-child-container gender-info'>
                    <div className='basic-info-title'>Giới tính</div>
                    <div className='basic-info-content'>{genders[personData.gender]}</div>
                </div>
                <div className='basic-info-child-container comp-count-info'>
                    <div className='basic-info-title'>Cuộc thi</div>
                    <div className='basic-info-content'>
                        {hasWcaid
                        ? `WCA ${personWcaData.numberOfCompetitions} | VNCA ${personData.competition_ids.length}`
                        : `VNCA ${personData.competition_ids.length}`
                        }
                    </div>
                </div>
                <div className='basic-info-child-container solve-count-info'>
                    <div className='basic-info-title'>Lượt giải</div>
                    <div className='basic-info-content'>
                        {hasWcaid
                        ? `WCA ${wcaCompletedSolves} | VNCA ${personData.completed_solves}`
                        : `VNCA ${personData.completed_solves}`
                        }
                    </div>
                </div>
            </div>

            <div className='personal-records-container'>
                <div className='personal-records-title'>Kỷ lục cá nhân</div>
                <div className='table-container'>
                    <table>
                        <thead>
                            <tr>
                                <td rowSpan={2} className='text-left'>Nội dung</td>
                                {hasWcaid &&
                                    <td colSpan={4} className='text-center'>WCA</td>
                                }
                                <td colSpan={4} className='text-center'>VNCA</td>
                            </tr>
                            <tr>
                                {hasWcaid &&
                                    <>
                                    <td className='text-right'>Đơn</td>
                                    <td>#</td>
                                    <td className='text-right'>Trung bình</td>
                                    <td>#</td>
                                    </>
                                }
                                <td className='text-right'>Đơn</td>
                                <td>#</td>
                                <td className='text-right'>Trung bình</td>
                                <td>#</td>
                            </tr>
                        </thead>
                        <tbody>
                            {(() => {
                                const filteredEvents = events.filter(event => {
                                    const hasWcaSingles = hasWcaid && personWcaData.rank.singles.some(r => r.eventId === event.id);
                                    const hasWcaAverages = hasWcaid && personWcaData.rank.averages.some(r => r.eventId === event.id);
                                    const hasLocalSingles = personData.rank.singles.some(r => r.event_id === event.id);
                                    const hasLocalAverages = personData.rank.averages.some(r => r.event_id === event.id);

                                    return hasWcaSingles || hasWcaAverages || hasLocalSingles || hasLocalAverages;
                                });

                                if (filteredEvents.length === 0) {
                                    return (
                                        <tr>
                                            <td colSpan={hasWcaid ? 9 : 5} className="text-center">
                                                Không có kết quả.
                                            </td>
                                        </tr>
                                    );
                                }

                                return filteredEvents.map((event, index) => {
                                    const wcaSingle = hasWcaid ? personWcaData.rank.singles.find(r => r.eventId === event.id) : null;
                                    const wcaAverage = hasWcaid ? personWcaData.rank.averages.find(r => r.eventId === event.id) : null;
                                    const localSingle = personData.rank.singles.find(r => r.event_id === event.id);
                                    const localAverage = personData.rank.averages.find(r => r.event_id === event.id);

                                    return (
                                        <tr key={index}>
                                            <td className="event-col">
                                                <img
                                                    src={event.is_official
                                                        ? `/assets/event_icons/event/${event.id}.svg`
                                                        : `/assets/event_icons/unofficial/${event.id}.svg`
                                                    }
                                                    alt={event.name}
                                                />
                                                <span>{event.name}</span>
                                            </td>
                                            {hasWcaid && (
                                                <>
                                                    <td className="text-right text-bold">{wcaSingle ? formatResult(event.id, wcaSingle.best, true) : ''}</td>
                                                    <td className={wcaSingle?.rank.country <= 10 ? 'in-top-10' : ''}>{wcaSingle ? wcaSingle.rank.country : ''}</td>
                                                    <td className="text-right text-bold">{wcaAverage ? formatResult(event.id, wcaAverage.best, false) : ''}</td>
                                                    <td className={wcaAverage?.rank.country <= 10 ? 'in-top-10' : ''}>{wcaAverage ? wcaAverage.rank.country : ''}</td>
                                                </>
                                            )}
                                            <td className="text-right text-bold">{localSingle ? formatResult(event.id, localSingle.result, true) : ''}</td>
                                            <td className={localSingle?.rank <= 10 ? 'in-top-10' : ''}>{localSingle ? localSingle.rank : ''}</td>
                                            <td className="text-right text-bold">{localAverage ? formatResult(event.id, localAverage.result, false) : ''}</td>
                                            <td className={localAverage?.rank <= 10 ? 'in-top-10' : ''}>{localAverage ? localAverage.rank : ''}</td>
                                        </tr>
                                    );
                                });
                            })()}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className='medals-records-container'>
                <div className='medals-records-child-container'>
                    <div className='medals-records-title'>Huy chương</div>
                    <div className='medals-records-content table-container'>
                        <table>
                            <thead>
                                <tr>
                                    <td></td>
                                    <td className='text-center'>
                                        <img
                                            src={`/assets/medals/gold_medal.svg`}
                                            alt="Vàng"
                                            title="Huy chương vàng"
                                            className="medal-icon"
                                        ></img>
                                    </td>
                                    <td className='text-center'>
                                        <img
                                            src={`/assets/medals/silver_medal.svg`}
                                            alt="Bạc"
                                            title="Huy chương bạc"
                                            className="medal-icon"
                                        ></img>
                                    </td>
                                    <td className='text-center'>
                                        <img
                                            src={`/assets/medals/bronze_medal.svg`}
                                            alt="Đồng"
                                            title="Huy chương đồng"
                                            className="medal-icon"
                                        ></img>
                                    </td>
                                </tr>
                            </thead>
                            <tbody>
                                {hasWcaid &&
                                    <tr>
                                        <td className='text-bold'>WCA</td>
                                        <td className='text-center'>{personWcaData.medals.gold}</td>
                                        <td className='text-center'>{personWcaData.medals.silver}</td>
                                        <td className='text-center'>{personWcaData.medals.bronze}</td>
                                    </tr>
                                }
                                <tr>
                                    <td className='text-bold'>VNCA</td>
                                    <td className='text-center'>{personData.medals.gold}</td>
                                    <td className='text-center'>{personData.medals.silver}</td>
                                    <td className='text-center'>{personData.medals.bronze}</td>
                                </tr>
                                {hasWcaid &&
                                    <tr>
                                        <td className='text-bold'>Tổng</td>
                                        <td className='text-center'>{personWcaData.medals.gold + personData.medals.gold}</td>
                                        <td className='text-center'>{personWcaData.medals.silver + personData.medals.silver}</td>
                                        <td className='text-center'>{personWcaData.medals.bronze + personData.medals.bronze}</td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
                {hasWcaid &&
                    <div className='medals-records-child-container'>
                        <div className='medals-records-title'>Kỷ lục WCA</div>
                        <div className='medals-records-content table-container'>
                            <table>
                                <thead>
                                    <tr>
                                        <td className='text-center'><span className="record-badge wr-badge" title='Kỷ lục thế giới'>WR</span></td>
                                        <td className='text-center'><span className="record-badge cr-badge" title='Kỷ lục châu Á'>AsR</span></td>
                                        <td className='text-center'><span className="record-badge nr-badge" title='Kỷ lục Việt Nam'>NR</span></td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className='text-center'>{(personWcaData.records.single.WR ? personWcaData.records.single.WR : 0) + (personWcaData.records.average.WR ? personWcaData.records.average.WR : 0)}</td>
                                        <td className='text-center'>{(personWcaData.records.single.CR ? personWcaData.records.single.CR : 0) + (personWcaData.records.average.CR ? personWcaData.records.average.CR : 0)}</td>
                                        <td className='text-center'>{(personWcaData.records.single.NR ? personWcaData.records.single.NR : 0) + (personWcaData.records.average.NR ? personWcaData.records.average.NR : 0)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                }
            </div>

            <div className='results-container'>
                <div className='results-title'>Kết quả</div>
                <div className='results-tabs'>
                    {hasWcaid &&
                        <div className={tab == 'wca' ? 'open' : 'close'} onClick={() => handleChangeTab('wca')}>WCA</div>
                    }
                    <div className={tab == 'vnca' ? 'open' : 'close'} onClick={() => handleChangeTab('vnca')}>VNCA</div>
                </div>
                {tab == 'wca'
                    ? (personWcaData.rank.singles.length == 0
                        ? <><div className='results-events-container'>
                            Không có kết quả.
                        </div>
                        <div className="results-table-container table-container"></div>
                        </>
                        : <><div className='results-events-container'>
                            {personWcaData.rank.singles.map((item, index) => (
                                <div className={tabEvent == item.eventId ? "is-focus" : "is-not-focus"} key={index}>
                                    <img src={`/assets/event_icons/event/${item.eventId}.svg`} alt={eventsObject[item.eventId].name} title={eventsObject[item.eventId].name} onClick={() => handleChangeTabEvent(item.eventId)} />
                                </div>
                            ))}
                        </div>

                        {(() => {
                            const compIds = Object.keys(personWcaData.results);
                            const filteredCompIds = compIds.filter(c =>
                                personWcaData.results[c].hasOwnProperty(tabEvent)
                            );

                            let maxSolveCount = 0;
                            filteredCompIds.forEach(compId => {
                                personWcaData.results[compId][tabEvent].forEach(round => {
                                    const count = solveCountByFormatId[round.format];
                                    if (maxSolveCount < count) maxSolveCount = count;
                                });
                            });

                            let bestSingle = Number.MAX_SAFE_INTEGER;
                            let bestAvg = Number.MAX_SAFE_INTEGER;

                            const rows = filteredCompIds.reverse().flatMap(compId => {
                                const compData = personWcaData.results[compId][tabEvent];
                                return compData.slice().reverse().map((round, roundIndex) => {
                                    const isPRSingle = round.best > 0 && round.best < bestSingle;
                                    const isPRAvg = round.average > 0 && round.average < bestAvg;
                                    if (isPRSingle) bestSingle = round.best;
                                    if (isPRAvg) bestAvg = round.average;

                                    return (
                                        <tr key={`${compId}-${roundIndex}`}>
                                            <td><a href={`https://www.worldcubeassociation.org/competitions/${compId}`} target='_blank'>{roundIndex === compData.length - 1 ? compId : ""}</a></td>
                                            <td><a href={`https://www.worldcubeassociation.org/competitions/${compId}/results/all?event=${tabEvent}`} target='_blank'>{rounds[round.round]}</a></td>
                                            <td>{round.position}</td>
                                            <td className={`text-right text-bold ${isPRSingle ? 'is-pr' : ''}`}>{formatResult(tabEvent, round.best, true)}</td>
                                            <td className={`text-left text-bold ${isPRAvg ? 'is-pr' : ''}`}>{formatResult(tabEvent, round.average, false)}</td>
                                            <SolvesColumns solves={round.solves} format={round.format} maxSolveCount={maxSolveCount} />
                                        </tr>
                                    )
                                });
                            });

                            return (
                                <div className="results-table-container table-container">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th colSpan={5 + maxSolveCount} className="event-col result-event-col">
                                                <img
                                                    src={
                                                    eventsObject[tabEvent].is_official
                                                        ? `/assets/event_icons/event/${tabEvent}.svg`
                                                        : `/assets/event_icons/unofficial/${tabEvent}.svg`
                                                    }
                                                    alt={eventsObject[tabEvent].name}
                                                />
                                                <span>{eventsObject[tabEvent].name}</span>
                                                </th>
                                            </tr>
                                            <tr>
                                                <th>Cuộc thi</th>
                                                <th>Vòng</th>
                                                <th>Hạng</th>
                                                <th className="text-right">Đơn</th>
                                                <th className="text-left">Trung bình</th>
                                                <th colSpan={maxSolveCount} className="text-center">
                                                Lượt giải
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>{rows.slice().reverse()}</tbody>
                                    </table>
                                </div>
                            );
                        })()}
                        </>
                    )
                    : (personData.rank.singles.length == 0
                        ? <><div className='results-events-container'>
                            Không có kết quả.
                        </div>
                        <div className="results-table-container table-container"></div>
                        </>
                        : <><div className='results-events-container'>
                            {personData.rank.singles.map((item, index) => (
                                <div className={tabEvent == item.event_id ? "is-focus" : "is-not-focus"} key={index}>
                                    <img
                                        src={eventsObject[item.event_id].is_official
                                            ? `/assets/event_icons/event/${item.event_id}.svg`
                                            : `/assets/event_icons/unofficial/${item.event_id}.svg`
                                        }
                                        alt={eventsObject[item.event_id].name}
                                        title={eventsObject[item.event_id].name}
                                        onClick={() => handleChangeTabEvent(item.event_id)}
                                    />
                                </div>
                            ))}
                        </div>

                        {(() => {
                            const filteredCompIds = personData.competition_ids.filter(c =>
                                personData.results[tabEvent].hasOwnProperty(c)
                            );

                            let maxSolveCount = 0;
                            personData.competition_ids.forEach(compId => {
                                personData.results[tabEvent][compId].rounds.forEach(round => {
                                    const count = solveCountByFormatId[round.format_id];
                                    if (maxSolveCount < count) maxSolveCount = count;
                                });
                            });

                            let bestSingle = Number.MAX_SAFE_INTEGER;
                            let bestAvg = Number.MAX_SAFE_INTEGER;

                            const rows = filteredCompIds.reverse().flatMap(compId => {
                                const compData = personData.results[tabEvent][compId].rounds;
                                return compData.slice().reverse().map((round, roundIndex) => {
                                    const isPRSingle = round.single > 0 && round.single < bestSingle;
                                    const isPRAvg = round.average > 0 && round.average < bestAvg;
                                    if (isPRSingle) bestSingle = round.single;
                                    if (isPRAvg) bestAvg = round.average;

                                    return (
                                        <tr key={`${compId}-${roundIndex}`}>
                                            <td><a href={`/competitions/vnca/${nameToSlug(personData.results[tabEvent][compId].competition_name, compId)}`} target='_blank'>{roundIndex === compData.length - 1 ? personData.results[tabEvent][compId].competition_name : ""}</a></td>
                                            <td><a href={`/competitions/vnca/${nameToSlug(personData.results[tabEvent][compId].competition_name, compId)}/results#${compId}-${tabEvent}-${roundIndex + 1}`} target='_blank'>{round.round_name}</a></td>
                                            <td>{round.position}</td>
                                            <td className={`text-right text-bold ${isPRAvg ? 'is-pr' : ''}`}>{formatResult(tabEvent, round.single, true)}</td>
                                            <td className={`text-left text-bold ${isPRAvg ? 'is-pr' : ''}`}>{formatResult(tabEvent, round.average, false)}</td>
                                            <SolvesColumns solves={round.solves} format={round.format_id} maxSolveCount={maxSolveCount} />
                                        </tr>
                                    )
                                });
                            });

                            return (
                                <div className="results-table-container table-container">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th colSpan={5 + maxSolveCount} className="event-col result-event-col">
                                                <img
                                                    src={
                                                    eventsObject[tabEvent].is_official
                                                        ? `/assets/event_icons/event/${tabEvent}.svg`
                                                        : `/assets/event_icons/unofficial/${tabEvent}.svg`
                                                    }
                                                    alt={eventsObject[tabEvent].name}
                                                />
                                                <span>{eventsObject[tabEvent].name}</span>
                                                </th>
                                            </tr>
                                            <tr>
                                                <th>Cuộc thi</th>
                                                <th>Vòng</th>
                                                <th>Hạng</th>
                                                <th className="text-right">Đơn</th>
                                                <th className="text-left">Trung bình</th>
                                                <th colSpan={maxSolveCount} className="text-center">
                                                Lượt giải
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>{rows.slice().reverse()}</tbody>
                                    </table>
                                </div>
                            );
                        })()}
                        </>
                    )
                }
                
            </div>
        </div>
    );
}