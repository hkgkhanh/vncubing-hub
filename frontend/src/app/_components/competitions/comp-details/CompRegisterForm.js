"use client";

import React, { useState, useEffect } from 'react';
import { checkRegisterForComp } from "@/app/handlers/competition-register";

export default function CompRegisterForm({ compData, isLoggedInPerson, isLoggedInOrganiser }) {
    const [hasRegistered, setHasRegistered] = useState(false);
    const [registration, setRegistration] = useState([]);
    const [isRegistering, setIsRegistering] = useState(false);
    console.log(compData);

    useEffect(() => {
        async function check() {
            if (isLoggedInPerson) {
                const res = await checkRegisterForComp(compData.id);
                if (res.ok) setHasRegistered(res.data.length > 0);
            }
        }
        check();
    }, [compData, isLoggedInPerson]);

    if (isLoggedInOrganiser) return (
        <div className='comp-register-form'>
            <h5>Tài khoản ban tổ chức không có quyền đăng ký cuộc thi này.</h5>
        </div>
    );

    if (!isLoggedInPerson && !isLoggedInOrganiser) return (
        <div className='comp-register-form'>
            <h5>Đăng nhập để đăng ký cuộc thi này.</h5>
        </div>
    );

    const handleToggleEventRegistration = (eventId) => {
        setRegistration((prev) =>
            prev.includes(eventId)
                ? prev.filter((id) => id !== eventId) // remove if exists
                : [...prev, eventId] // add if not exists
        );
    };

    const handleChooseAllEvents = () => {
        const allEventIds = compData.events.map((item) => item.event_id);
        setRegistration(allEventIds);
    };

    const handleClearAllEvents = () => {
        setRegistration([]);
    };

    const handleRegister = () => {
        setIsRegistering(true);
    }
    
    return (
        <div className='comp-register-form'>
            <h3>Đơn đăng ký</h3>
            <hr></hr>
            {!hasRegistered &&
            <>
                <div className='comp-register-events-handlers'>
                    <button className='choose-all' onClick={() => handleChooseAllEvents()}>Chọn tất cả</button>
                    <button className='clear-all' onClick={() => handleClearAllEvents()}>Bỏ chọn tất cả</button>
                </div>
                <div className="comp-register-events">
                {compData.events.map((item, index) => {
                    const isSelected = registration.includes(item.event_id);
                    return (
                    <span
                        key={index}
                        onClick={() => handleToggleEventRegistration(item.event_id)}
                        className={isSelected ? 'is-registered' : 'is-not-registered'}
                    >
                        <img
                            src={item.is_official
                                ? `/assets/event_icons/event/${item.event_id}.svg`
                                : `/assets/event_icons/unofficial/${item.event_id}.svg`
                            }
                            alt={item.name}
                            key={index}
                            title={item.name}
                        />
                    </span>)
                })}
                </div>
                <hr></hr>
                <div className='comp-register-buttons'>
                    <button onClick={() => handleRegister()} className={isRegistering ? 'disable-button' : 'enable-button'} disabled={isRegistering}>{!isRegistering ? "Đăng ký" : "Đang đăng ký..."}</button>
                </div>
            </>
            }
        </div>
    );
}