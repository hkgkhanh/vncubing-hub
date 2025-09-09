"use client";

import React, { useState, useEffect } from 'react';
import { getRegistrationsListForComp } from "@/app/handlers/competition-register";

function SortIndicator({ columnKey, sortConfig }) {
    if (sortConfig.key !== columnKey) return null;
    return <span>{sortConfig.direction === "asc" ? " ▲" : " ▼"}</span>;
}

export default function CompRegistrationsList({ compData }) {
    const [isLoading, setIsLoading] = useState(true);
    const [registrations, setRegistrations] = useState([]);
    const [displayRegistrations, setDisplayRegistrations] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
    // console.log(compData);

    function getRegistrationCount(event_id) {
        let count = 0;
        for (let i = 0; i < registrations.length; i++) {
            if (registrations[i].REGISTRATION_EVENTS.some(el => el.event_id == event_id)) count++;
        }
        return count;
    }

    function getTotalRegistrationCount(events) {
        let count = 0;
        for (let i = 0; i < events.length; i++) {
            count += getRegistrationCount(events[i].event_id);
        }
        return count;
    }

    useEffect(() => {
        async function check() {
            const res = await getRegistrationsListForComp({ comp_id: compData.id });
            if (!res.ok) alert("Tải trang thất bại, vui lòng thử lại.");
            // console.log(res.data);
            setRegistrations(res.data);
            setDisplayRegistrations(res.data);
            setIsLoading(false);
        }
        check();
    }, []);

    useEffect(() => {
        const sortedRegistrations = [...registrations].sort((a, b) => {
            let aValue, bValue;

            if (sortConfig.key === 'name') {
                aValue = a.PERSONS.name.toLowerCase();
                bValue = b.PERSONS.name.toLowerCase();
            } else if (sortConfig.key === 'total') {
                aValue = a.REGISTRATION_EVENTS.length;
                bValue = b.REGISTRATION_EVENTS.length;
            } else {
                const eventId = sortConfig.key;
                aValue = a.REGISTRATION_EVENTS.some(el => el.event_id == eventId) ? 1 : 0;
                bValue = b.REGISTRATION_EVENTS.some(el => el.event_id == eventId) ? 1 : 0;
            }

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            const nameA = a.PERSONS.name.toLowerCase();
            const nameB = b.PERSONS.name.toLowerCase();
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
        });
        setDisplayRegistrations(sortedRegistrations);
    }, [registrations, sortConfig]);

    function handleSort(key) {
        setSortConfig((prev) => {
            if (prev.key === key) {
                // toggle asc/desc
                return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
            }
            // new sort key
            return { key, direction: 'asc' };
        });
    }

    if (isLoading) return (
        <div className='comp-register-form'>
            <div className='spinner-container'>
                <img
                    src="/ui/spinner.svg"
                    alt="Loading"
                    className="spinner"
                    title="Loading"
                />
            </div>
        </div>
    )
    
    return (
        <div className='table-container'>
            <table>
                <thead>
                    <tr>
                        <td onClick={() => handleSort('name')}>
                            Họ và tên
                            <SortIndicator columnKey='name' sortConfig={sortConfig} />
                        </td>
                        {compData.events.map((item, index) => (
                        <td key={index} onClick={() => handleSort(item.event_id)}>
                            <div>
                                <img
                                    src={item.is_official
                                        ? `/assets/event_icons/event/${item.event_id}.svg`
                                        : `/assets/event_icons/unofficial/${item.event_id}.svg`
                                    }
                                    alt={item.name}
                                    key={index}
                                    title={item.name}
                                />
                                <SortIndicator columnKey={item.event_id} sortConfig={sortConfig} />
                            </div>
                        </td>
                        ))}
                        <td className='center-content' onClick={() => handleSort('total')}>
                            Tổng cộng
                            <SortIndicator columnKey={'total'} sortConfig={sortConfig} />
                        </td>
                    </tr>
                </thead>
                <tbody>
                    {displayRegistrations.map((item, index) => (
                        <tr key={index}>
                            <td>{item.PERSONS.name}</td>
                            {compData.events.map((event_item, event_index) => (
                            <td key={event_index}>
                                <div>
                                    {item.REGISTRATION_EVENTS.some(el => el.event_id == event_item.event_id) &&
                                        <img
                                            src={event_item.is_official
                                                ? `/assets/event_icons/event/${event_item.event_id}.svg`
                                                : `/assets/event_icons/unofficial/${event_item.event_id}.svg`
                                            }
                                            alt={event_item.name}
                                            key={event_index}
                                            title={event_item.name}
                                        />
                                    }
                                </div>
                            </td>
                            ))}
                            <td className='center-content'>{item.REGISTRATION_EVENTS.length}</td>
                        </tr>
                    ))}
                    <tr>
                        <td>{`${registrations.length} người`}</td>
                        {compData.events.map((event_item, event_index) => (
                        <td key={event_index} className='center-content'>{getRegistrationCount(event_item.event_id)}</td>
                        ))}
                        <td className='center-content'>{getTotalRegistrationCount(compData.events)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}