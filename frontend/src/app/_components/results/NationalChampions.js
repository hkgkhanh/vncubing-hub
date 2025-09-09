"use client";

import { useState } from 'react';
import '@/app/_styles/results/default.css';
import eventsData from "@/data/results-filter.json";

export default function NationalChampions({ data }) {
    const [event, setEvent] = useState("3x3x3");
    const oldWcaEvents = eventsData["old_wca"];
    const wcaEvents = eventsData["wca_filter"].event.filter(e => !oldWcaEvents.includes(e.id));

    const handleChangeEvent = (event) => {
        setEvent(event);
    }

    return (
        <>
            <div className='national-champs-event'>
                {wcaEvents.map((item, index) => (
                    <div className={event == item.name_vi ? "is-focus" : ""} key={index} onClick={() => handleChangeEvent(item.name_vi)}>
                        <img src={`/assets/event_icons/event/${item.id}.svg`} alt={item.name_vi} title={item.name_vi} />
                    </div>
                ))}

                <table>
                    <thead>
                        <tr>
                            <th>Năm</th>
                            <th>Họ và tên</th>
                            <th>Kết quả</th>
                            <th>Chi tiết</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data[event].map((item, index) => (
                            <tr key={index}>
                                <td>{item.year}</td>
                                <td>{item.name}</td>
                                <td>{item.result}</td>
                                <td>{item.details}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}