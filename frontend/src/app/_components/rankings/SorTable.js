"use client";

import { useState, useEffect } from 'react';
import '@/app/_styles/rankings/default.css';

export default function SorTable({ data, participation, category, events, type, loadingStatus }) {
    const [navbarHeight, setNavbarHeight] = useState(0);

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
                
            ) : (
                <table>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Họ và tên</th>
                        <th>
                            <img
                                src='/assets/summation.svg'
                                alt='Tổng thứ hạng'
                                title='Tổng thứ hạng'
                                className="sor-event-icon"
                            />
                        </th>
                        {events.filter(p => participation[p][type] > 0).map((item, index) => (
                            <th key={index}>
                                <img
                                    src={`/assets/event_icons/event/${item}.svg`}
                                    alt={item}
                                    title={item}
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
                                <td className='sor-column'>{item.sor[category][type]}</td>
                                {events.filter(p => participation[p][type] > 0).map((eventItem, eventIndex) => (
                                    <td
                                        key={eventIndex}
                                        className={ item.rank[eventItem][type] > participation[eventItem][type]
                                            ? 'is-worst'
                                            : item.rank[eventItem][type] < 11
                                            ? 'is-top-10'
                                            : ''
                                        }
                                    >{item.rank[eventItem][type]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}