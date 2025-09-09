"use client";

import React, { useState, useEffect } from 'react';
import { checkRegisterForComp, registerForComp, getRegistrationForComp, editRegisterForComp, cancelRegisterForComp } from "@/app/handlers/competition-register";

export default function CompRegisterForm({ compData, isLoggedInPerson, isLoggedInOrganiser }) {
    const [isLoading, setIsLoading] = useState(true);
    const [hasRegistered, setHasRegistered] = useState(false);
    const [registration, setRegistration] = useState([]);
    const [isRegistering, setIsRegistering] = useState(false);
    const [isActioned, setIsActioned] = useState(false);
    const [actionMessage, setActionMessage] = useState('');
    const [registrationStatus, setRegistrationStatus] = useState(-1);
    // console.log(compData);

    useEffect(() => {
        async function check() {
            if (isLoggedInPerson) {
                const res = await checkRegisterForComp(compData.id);
                if (res.ok) {
                    setHasRegistered(res.data);
                    setRegistrationStatus(res.registrationStatus != null ? res.registrationStatus : -1);
                }
            }
            setIsLoading(false);
        }
        check();
    }, [compData, isLoggedInPerson]);

    useEffect(() => {
        async function check() {
            setIsLoading(true);
            if (hasRegistered) {
                const res = await getRegistrationForComp(compData.id);
                if (res.ok) setRegistration(res.data);
                setRegistrationStatus(res.registrationStatus != null ? res.registrationStatus : -1);
            }
            setIsLoading(false);
        }
        check();
    }, [hasRegistered]);

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
        if (isRegistering) return;

        setRegistration((prev) =>
            prev.includes(eventId)
                ? prev.filter((id) => id !== eventId) // remove if exists
                : [...prev, eventId] // add if not exists
        );
    };

    const handleChooseAllEvents = () => {
        if (isRegistering) return;

        const allEventIds = compData.events.map((item) => item.event_id);
        setRegistration(allEventIds);
    };

    const handleClearAllEvents = () => {
        if (isRegistering) return;
        setRegistration([]);
    };

    const handleRegister = async () => {
        if (registration.length < 1) {
            alert("Hãy chọn nội dung đăng ký.");
            return;
        }
        setIsRegistering(true);

        function getCurrentLocalISOString(date = new Date()) {
            const tzOffset = date.getTimezoneOffset() * 60000; // in ms
            const localISOTime = new Date(date - tzOffset).toISOString().slice(0, -1);
            return localISOTime;
        }

        const timestamp = getCurrentLocalISOString();

        const res = await registerForComp({ comp_id: compData.id, events: registration, timestamp: timestamp });
        if (!res.ok) alert("Đã có lỗi, vui lòng thử lại.");

        setIsRegistering(false);
        setHasRegistered(true);
        setIsActioned(true);
        setActionMessage('Đăng ký thành công.');
        setRegistrationStatus(0);
    }

    const handleEditRegister = async () => {
        if (registration.length < 1) {
            alert("Hãy chọn nội dung đăng ký.");
            return;
        }
        setIsRegistering(true);

        function getCurrentLocalISOString(date = new Date()) {
            const tzOffset = date.getTimezoneOffset() * 60000; // in ms
            const localISOTime = new Date(date - tzOffset).toISOString().slice(0, -1);
            return localISOTime;
        }

        const timestamp = getCurrentLocalISOString();

        const res = await editRegisterForComp({ comp_id: compData.id, events: registration, timestamp: timestamp });
        if (!res.ok) alert("Đã có lỗi, vui lòng thử lại.");

        setIsRegistering(false);
        setHasRegistered(true);
        setIsActioned(true);
        setActionMessage('Cập nhật đơn đăng ký thành công.');
        setRegistrationStatus(0);
    }

    const handleCancelRegister = async () => {
        setIsRegistering(true);

        const res = await cancelRegisterForComp({ comp_id: compData.id });
        if (!res.ok) alert("Đã có lỗi, vui lòng thử lại.");

        setIsRegistering(false);
        setHasRegistered(true);
        setIsActioned(true);
        setActionMessage('Gửi yêu cầu hủy đăng ký thành công.');
        setRegistrationStatus(3);
    }
    
    return (
        <>
        {registrationStatus != -1 &&
            <div className='comp-register-status'>
                {registrationStatus === 0 &&
                <>
                <div className='comp-register-status-header status-0'>{"Đang chờ duyệt"}</div>
                <div className='comp-register-status-content'>{"Đơn đăng ký của bạn đã được gửi đi thành công, hãy kiên nhẫn chờ ban tổ chức xác nhận."}</div>
                </>
                }
                {registrationStatus === 1 &&
                <>
                <div className='comp-register-status-header status-1'>{"Thành công"}</div>
                <div className='comp-register-status-content'>{"Đơn đăng ký của bạn đã được xác nhận, hẹn gặp lại bạn tại cuộc thi!"}</div>
                </>
                }
                {registrationStatus === 2 &&
                <>
                <div className='comp-register-status-header status-2'>{"Danh sách chờ"}</div>
                <div className='comp-register-status-content'>{"Đơn đăng ký của bạn đã được xác nhận, tuy nhiên số lượng thí sinh đăng ký đã đạt giới hạn của giải đấu. Nếu có người khác hủy đăng ký và bạn nằm ở đầu danh sách chờ, đơn đăng ký bạn sẽ được xác nhận."}</div>
                </>
                }
                {registrationStatus === 3 &&
                <>
                <div className='comp-register-status-header status-3'>{"Yêu cầu hủy"}</div>
                <div className='comp-register-status-content'>{"Bạn đã yêu cầu hủy đăng ký thành công, hãy kiên nhẫn chờ ban tổ chức xác nhận."}</div>
                </>
                }
                {registrationStatus === 4 &&
                <>
                <div className='comp-register-status-header status-4'>{"Đã hủy đăng ký"}</div>
                <div className='comp-register-status-content'>{"Yêu cầu hủy đăng ký của bạn đã được xác nhận, bạn có thể đăng ký lại tại trang này."}</div>
                </>
                }
            </div>
        }
        
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

            {hasRegistered &&
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
                    <button onClick={() => handleEditRegister()} className={isRegistering ? 'disable-button' : 'enable-button'} disabled={isRegistering}>{!isRegistering ? "Cập nhật" : "Đang cập nhật..."}</button>
                    <button onClick={() => handleCancelRegister()} className={(isRegistering || registrationStatus == 3 || registrationStatus == 4) ? 'disable-button' : ' cancel-button'} disabled={(isRegistering || registrationStatus == 3 || registrationStatus == 4)}>{!isRegistering ? "Hủy đăng ký" : "Đang hủy đăng ký..."}</button>
                </div>
            </>
            }
        </div>
        {isActioned &&
            <div className='update-register-notification'>
                <span>{actionMessage}</span>
                <span onClick={() => setIsActioned(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z"/></svg>
                </span>
            </div>
        }
        </>
    );
}