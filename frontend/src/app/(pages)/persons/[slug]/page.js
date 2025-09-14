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

    const genders = {
        'm': 'Nam',
        'f': 'Nữ',
        'o': 'Khác',
        'u': 'Không xác định'
    };

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

            if (data.data.wcaid != null) {
                const wcaData = await getPersonWcaInfoById(data.data.wcaid);
                if (!wcaData.ok) alert("Tải trang thất bại, vui lòng thử lại.");

                setPersonWcaData(wcaData.data);
                setWcaCompletedSolves(countCompletedSolves(wcaData.data.results, wcaData.data.competitionIds));
            }

            const eventsData = await getVncaEvents();
            setEvents(eventsData);

            // const hashPart = window.location.hash;
            // if (hashPart) setTabOpening(hashPart.slice(1));
            
            setIsLoading(false);
        }
        
        fetchPerson();
    }, []);

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
                        <div className='basic-info-content'>{personData.wcaid}</div>
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
                            {events.filter(event => {
                                // only include events if they have data (WCA or VNCA)
                                const hasWcaSingles = hasWcaid && personWcaData.rank.singles.some(r => r.eventId === event.id);
                                const hasWcaAverages = hasWcaid && personWcaData.rank.averages.some(r => r.eventId === event.id);
                                const hasLocalSingles = personData.rank.singles.some(r => r.event_id === event.id);
                                const hasLocalAverages = personData.rank.averages.some(r => r.event_id === event.id);

                                return hasWcaSingles || hasWcaAverages || hasLocalSingles || hasLocalAverages;
                            }).map((event, index) => {
                                // store lookups instead of calling find() repeatedly
                                const wcaSingle = hasWcaid ? personWcaData.rank.singles.find(r => r.eventId === event.id) : null;
                                const wcaAverage = hasWcaid ? personWcaData.rank.averages.find(r => r.eventId === event.id) : null;
                                const localSingle = personData.rank.singles.find(r => r.event_id === event.id);
                                const localAverage = personData.rank.averages.find(r => r.event_id === event.id);

                                return (
                                    <tr key={index}>
                                        <td className='event-col'>
                                            <img
                                                src={event.is_official
                                                    ? `/assets/event_icons/event/${event.id}.svg`
                                                    : `/assets/event_icons/unofficial/${event.id}.svg`
                                                }
                                                key={event.id}
                                            />
                                            <span>{event.name}</span>
                                        </td>
                                        {hasWcaid && (
                                        <>
                                            <td className='text-right text-bold'>{wcaSingle ? wcaSingle.best : ''}</td>
                                            <td>{wcaSingle ? wcaSingle.rank.country : ''}</td>
                                            <td className='text-right text-bold'>{wcaAverage ? wcaAverage.best : ''}</td>
                                            <td>{wcaAverage ? wcaAverage.rank.country : ''}</td>
                                        </>
                                        )}
                                        <td className='text-right text-bold'>{localSingle ? localSingle.result : ''}</td>
                                        <td>{localSingle ? localSingle.rank : ''}</td>
                                        <td className='text-right text-bold'>{localAverage ? localAverage.result : ''}</td>
                                        <td>{localAverage ? localAverage.rank : ''}</td>
                                    </tr>
                                );
                            })}
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
                        <div className='medals-records-title'>Kỷ lục</div>
                        <div className='medals-records-content table-container'>
                            <table>
                                <thead>
                                    <tr>
                                        <td className='text-center'><span className="record-badge wr-badge">WR</span></td>
                                        <td className='text-center'><span className="record-badge cr-badge">AsR</span></td>
                                        <td className='text-center'><span className="record-badge nr-badge">NR</span></td>
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
        </div>
    );
}