"use client";

import { useState, useEffect } from 'react';
import '@/app/_styles/rankings/default.css';

export default function RecordsTable({ data, loadingStatus }) {
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
                        <th><span className="record-badge wr-badge">WR</span></th>
                        <th><span className="record-badge cr-badge">AsR</span></th>
                        <th><span className="record-badge nr-badge">NR</span></th>
                        <th>
                            <img
                                src={`/assets/summation.svg`}
                                alt="Tổng"
                                title="Tổng"
                                className="medal-icon"
                            ></img>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index}>
                                <td>{item.actualRank}</td>
                                <td className='ext-link' onClick={() => openProfileOnWca(item.personId)}>{item.personName}</td>
                                <td>{item.records.WR}</td>
                                <td>{item.records.CR}</td>
                                <td>{item.records.NR}</td>
                                <td>{item.records.WR + item.records.CR + item.records.NR}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}