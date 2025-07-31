"use client";

import { useState, useEffect } from 'react';
import '@/app/_styles/results/default.css';
import ResultsFilters from '../../../data/results-filter.json';

export default function KinchTable({ data, loadingStatus }) {
    const [navbarHeight, setNavbarHeight] = useState(0);
    const events = ResultsFilters['wca_filter']['event'];

    useEffect(() => {
    const navbarElement = document.getElementById("navbar");
    if (navbarElement) {
        setNavbarHeight(navbarElement.offsetHeight);

        const resizeObserver = new ResizeObserver(() => {
            setNavbarHeight(navbarElement.offsetHeight);
        });

        resizeObserver.observe(navbarElement);

        return () => resizeObserver.disconnect();
    }
    }, []);

    function openProfileOnWca(personId) {
        const url = `https://www.worldcubeassociation.org/persons/${personId}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    }

    function formatKinchScore(score) {
        return score.toFixed(2);
    }

    if (!loadingStatus && data.length == 0) {
        return (
            <div className="no-result">
                Không có kết quả.
            </div>
        );
    }

    return (
        <div className="ranking-table kinch-table" style={{ '--navbar-offset': `${navbarHeight}px` }}>
            {loadingStatus ? (
                <div className='spinner-container'>
                    <img
                        src="/ui/spinner.svg"
                        alt="Loading"
                        className="spinner"
                        title="Loading"
                    />
                </div>
                
            ) : (
                <table>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Họ và tên</th>
                        <th>Kinch</th>
                        {events.map((item, index) => (
                            <th key={index}>
                                <img
                                    src={`/assets/event_icons/event/${item.id}.svg`}
                                    alt={item.name_vi}
                                    title={item.name_vi}
                                    className="sor-event-icon"
                                />
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index}>
                                <td>{item.actualRank}</td>
                                <td className='ext-link' onClick={() => openProfileOnWca(item.personId)}>{item.personName}</td>
                                <td className='sor-column'>{formatKinchScore(item.avgKinchScore)}</td>
                                {events.map((eventItem, eventIndex) => (
                                    <td
                                        key={eventIndex}
                                        className={ item.kinchScore[eventItem.id] == 0
                                            ? 'is-0'
                                            : item.kinchScore[eventItem.id] == 100
                                            ? 'is-100'
                                            : ''
                                        }
                                    >{formatKinchScore(item.kinchScore[eventItem.id])}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}