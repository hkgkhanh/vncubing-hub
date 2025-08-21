'use client';

import { useEffect, useState } from 'react';
import { getWcaEvents, getNonWcaEvents } from '@/app/handlers/events';

export default function CompEventsEditor({ initialRounds, onSaveAll }) {
    const [compEventRounds, setCompEventRounds] = useState(initialRounds);
    const [wcaEvents, setWcaEvents] = useState([]);
    const [nonWcaEvents, setNonWcaEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const TIME_REGEX = /^(?:(\d+):([0-5]\d)|(\d{1,2}))\.(\d{2})$/;

    useEffect(() => {
        async function fetchEvents() {
            try {
                const cachedWca = sessionStorage.getItem("wcaEvents");
                const cachedNonWca = sessionStorage.getItem("nonWcaEvents");

                if (cachedWca && cachedNonWca) {
                    setWcaEvents(JSON.parse(cachedWca));
                    setNonWcaEvents(JSON.parse(cachedNonWca));
                    setIsLoading(false);
                    // console.log("get from local storage");
                    return;
                }

                const wca = await getWcaEvents();
                const nonWca = await getNonWcaEvents();
                // console.log("get from db");

                setWcaEvents(wca);
                setNonWcaEvents(nonWca);

                sessionStorage.setItem("wcaEvents", JSON.stringify(wca));
                sessionStorage.setItem("nonWcaEvents", JSON.stringify(nonWca));
            } catch (err) {
                console.error("Error fetching events:", err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchEvents();
    }, []);

    // console.log(wcaEvents);
    // console.log(nonWcaEvents);

    useEffect(() => {
        onSaveAll(compEventRounds);
    }, [compEventRounds]);

    const addEvent = (event_id) => {
        setCompEventRounds(prev => {
            const newRound = {
                event_id,
                format_id: 'a',
                name: null,
                from_datetime: null,
                till_datetime: null,
                to_advance: null,
                is_not_round: false,
                time_limit: null,
                cutoff: null,
                next_round: null,
                str_id: `${event_id}-1`
            };

            const { [event_id]: _, ...rest } = prev;
            const newObj = {
                ...rest,
                [event_id]: [newRound]
            };

            console.log("Updated rounds:", newObj);
            return newObj;
        });
    };

    const removeEvent = (event_id) => {
        setCompEventRounds(prev => {
            const { [event_id]: _, ...rest } = prev;
            const newObj = {
                ...rest,
            };

            console.log("Updated rounds:", newObj);
            return newObj;
        });
    }

    const updateEventRoundCount = (event_id, roundCount) => {
        setCompEventRounds(prev => {
            let newRounds = [];
            for (let i = 0; i < roundCount; i++) {
                const newRound = {
                    event_id,
                    format_id: 'a',
                    name: null,
                    from_datetime: null,
                    till_datetime: null,
                    to_advance: null,
                    is_not_round: false,
                    time_limit: null,
                    cutoff: null,
                    next_round: null,
                    str_id: `${event_id}-${i + 1}`
                };
                newRounds.push(newRound);
            }

            const { [event_id]: _, ...rest } = prev;
            const newObj = {
                ...rest,
                [event_id]: newRounds
            };

            console.log("Updated rounds:", newObj);
            return newObj;
        });
    }

    const updateEventFormat = (event_id, index, format_id) => {
        setCompEventRounds(prev => {
            const rounds = prev[event_id] || [];

            const updatedRounds = rounds.map((round, i) =>
                i === index ? { ...round, format_id } : round
            );

            const newObj = {
                ...prev,
                [event_id]: updatedRounds
            };

            console.log("Updated compEventRounds:", newObj);
            return newObj;
        });
    }

    function intToTime(value) {
        if (value == null || isNaN(value)) return "";

        const totalSeconds = Math.floor(value / 100);
        const centiseconds = value % 100;

        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        if (minutes > 0) {
            // Format as M:ss.mm
            return `${minutes}:${seconds.toString().padStart(2, "0")}.${centiseconds
            .toString()
            .padStart(2, "0")}`;
        } else {
            // Format as ss.mm
            return `${seconds}.${centiseconds.toString().padStart(2, "0")}`;
        }
    }

    const updateEventTimeLimit = (event_id, index, value) => {
        setCompEventRounds(prev => {
            const rounds = prev[event_id] || [];
            
            let newValue = null;
            // const timeRegex = /^(?:(\d+):([0-5]\d)|(\d{1,2}))\.(\d{2})$/;
            const match = value.match(TIME_REGEX);

            if (match) {
                const minutes = match[1] ? parseInt(match[1], 10) : 0;
                const seconds = match[2] ? parseInt(match[2], 10) : parseInt(match[3] || "0", 10);
                const centiseconds = parseInt(match[4], 10);

                newValue = (minutes * 60 + seconds) * 100 + centiseconds;
            }

            const updatedRounds = rounds.map((round, i) =>
                i === index ? { ...round, time_limit: newValue } : round
            );

            const newObj = {
                ...prev,
                [event_id]: updatedRounds
            };

            console.log("Updated compEventRounds:", newObj);
            return newObj;
        });
    }

    const updateEventCutoff = (event_id, index, value) => {
        setCompEventRounds(prev => {
            const rounds = prev[event_id] || [];
            
            let newValue = null;
            // const timeRegex = /^(?:\d+:[0-5]\d|\d{1,2})\.\d{2}$/;
            const match = value.match(TIME_REGEX);

            if (match) {
                const minutes = match[1] ? parseInt(match[1], 10) : 0;
                const seconds = match[2] ? parseInt(match[2], 10) : parseInt(match[3] || "0", 10);
                const centiseconds = parseInt(match[4], 10);

                newValue = (minutes * 60 + seconds) * 100 + centiseconds;
            }

            const updatedRounds = rounds.map((round, i) =>
                i === index ? { ...round, cutoff: newValue } : round
            );

            const newObj = {
                ...prev,
                [event_id]: updatedRounds
            };

            console.log("Updated compEventRounds:", newObj);
            return newObj;
        });
    }

    const updateEventToAdvance = (event_id, index, value) => {
        setCompEventRounds(prev => {
            const rounds = prev[event_id] || [];

            const updatedRounds = rounds.map((round, i) =>
                i === index ? { ...round, to_advance: parseInt(value) } : round
            );

            const newObj = {
                ...prev,
                [event_id]: updatedRounds
            };

            console.log("Updated compEventRounds:", newObj);
            return newObj;
        });
    }

    if (isLoading) return (
        <>
        <div className='spinner-container'>
            <img
                src="/ui/spinner.svg"
                alt="Loading"
                className="spinner"
                title="Loading"
            />
        </div>
        </>
    )

    return (
    <>
        <div className='event-edit-tab-box'>
            {wcaEvents.map((event, index) => (
                <div className='event-edit' key={index}>
                    <div className='event-edit-header'>
                        <div className='event-edit-header-left'>
                            {event.name}
                        </div>
                        <div className='event-edit-header-right'>
                            {compEventRounds[event.id]?.length > 0 ?
                                <>
                                    {/* <span className='bg-blue'>Thêm vòng đấu</span> */}
                                    <select defaultValue='1' onChange={(e) => updateEventRoundCount(event.id, e.target.value)}>
                                        <option value="1">1 vòng</option>
                                        <option value="2">2 vòng</option>
                                        <option value="3">3 vòng</option>
                                        <option value="4">4 vòng</option>
                                        <option value="5">5 vòng</option>
                                    </select>
                                    <span className='bg-red' onClick={() => removeEvent(event.id)}>Xóa nội dung</span>
                                </> :
                                <span className='bg-green' onClick={() => addEvent(event.id)}>Thêm nội dung</span>
                            }
                        </div>
                    </div>
                    {compEventRounds[event.id]?.length > 0 &&
                        <table>
                            <thead>
                                <tr>
                                    <td>#</td>
                                    <td>Thể thức</td>
                                    <td>Giới hạn thời gian</td>
                                    <td>Cutoff</td>
                                    <td>Vào vòng sau</td>
                                </tr>
                            </thead>
                            <tbody>
                                {compEventRounds[event.id].map((event_round, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <select value={event_round.format_id} onChange={(e) => updateEventFormat(event.id, index, e.target.value)}>
                                                <option value="1">bo1</option>
                                                <option value="2">bo2</option>
                                                <option value="3">bo3</option>
                                                <option value="a">ao5</option>
                                                <option value="m">mo3</option>
                                            </select>
                                        </td>
                                        <td>
                                            <input
                                                key={event_round.time_limit ?? "empty"}
                                                type="text"
                                                placeholder='MM:ss.mm'
                                                pattern='(?:\d+:[0-5]\d|\d{1,2})\.\d{2}'
                                                defaultValue={intToTime(event_round.time_limit) || ""}
                                                onBlur={(e) => {
                                                    const v = e.target.value.trim();
                                                    if (TIME_REGEX.test(v)) {
                                                        updateEventTimeLimit(event.id, index, v);
                                                    } else {
                                                        // revert to last valid value
                                                        e.target.value = intToTime(event_round.time_limit) || "";
                                                    }
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                key={event_round.time_limit ?? "empty"}
                                                type="text"
                                                placeholder='MM:ss.mm'
                                                pattern='(?:\d+:[0-5]\d|\d{1,2})\.\d{2}'
                                                defaultValue={intToTime(event_round.cutoff) || ""}
                                                onBlur={(e) => {
                                                    const v = e.target.value.trim();
                                                    if (TIME_REGEX.test(v)) {
                                                        updateEventCutoff(event.id, index, v);
                                                    } else {
                                                        // revert to last valid value
                                                        e.target.value = intToTime(event_round.cutoff) || "";
                                                    }
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                className='input-number'
                                                type="text"
                                                placeholder='16'
                                                pattern='[1-9]\d*'
                                                value={event_round.to_advance || ""}
                                                onChange={(e) => {
                                                    updateEventToAdvance(event.id, index, e.target.value);
                                                }}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    }
                </div>
            ))}
        </div>

        <hr></hr>

        <div className='event-edit-tab-box'>
            {nonWcaEvents.map((event, index) => (
                <div className='event-edit' key={index}>
                    <div className='event-edit-header'>
                        <div className='event-edit-header-left'>
                            {event.name}
                        </div>
                        <div className='event-edit-header-right'>
                            {compEventRounds[event.id]?.length > 0 ?
                                <>
                                    {/* <span className='bg-blue'>Thêm vòng đấu</span> */}
                                    <select defaultValue='1' onChange={(e) => updateEventRoundCount(event.id, e.target.value)}>
                                        <option value="1">1 vòng</option>
                                        <option value="2">2 vòng</option>
                                        <option value="3">3 vòng</option>
                                        <option value="4">4 vòng</option>
                                        <option value="5">5 vòng</option>
                                    </select>
                                    <span className='bg-red' onClick={() => removeEvent(event.id)}>Xóa nội dung</span>
                                </> :
                                <span className='bg-green' onClick={() => addEvent(event.id)}>Thêm nội dung</span>
                            }
                        </div>
                    </div>
                    {compEventRounds[event.id]?.length > 0 &&
                        <table>
                            <thead>
                                <tr>
                                    <td>#</td>
                                    <td>Thể thức</td>
                                    <td>Giới hạn thời gian</td>
                                    <td>Cutoff</td>
                                    <td>Vào vòng sau</td>
                                </tr>
                            </thead>
                            <tbody>
                                {compEventRounds[event.id].map((event_round, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <select value={event_round.format_id} onChange={(e) => updateEventFormat(event.id, index, e.target.value)}>
                                                <option value="1">bo1</option>
                                                <option value="2">bo2</option>
                                                <option value="3">bo3</option>
                                                <option value="a">ao5</option>
                                                <option value="m">mo3</option>
                                            </select>
                                        </td>
                                        <td>
                                            <input
                                                key={event_round.time_limit ?? "empty"}
                                                type="text"
                                                placeholder='MM:ss.mm'
                                                pattern='(?:\d+:[0-5]\d|\d{1,2})\.\d{2}'
                                                defaultValue={intToTime(event_round.time_limit) || ""}
                                                onBlur={(e) => {
                                                    const v = e.target.value.trim();
                                                    if (TIME_REGEX.test(v)) {
                                                        updateEventTimeLimit(event.id, index, v);
                                                    } else {
                                                        // revert to last valid value
                                                        e.target.value = intToTime(event_round.time_limit) || "";
                                                    }
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                key={event_round.time_limit ?? "empty"}
                                                type="text"
                                                placeholder='MM:ss.mm'
                                                pattern='(?:\d+:[0-5]\d|\d{1,2})\.\d{2}'
                                                defaultValue={intToTime(event_round.cutoff) || ""}
                                                onBlur={(e) => {
                                                    const v = e.target.value.trim();
                                                    if (TIME_REGEX.test(v)) {
                                                        updateEventCutoff(event.id, index, v);
                                                    } else {
                                                        // revert to last valid value
                                                        e.target.value = intToTime(event_round.cutoff) || "";
                                                    }
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                className='input-number'
                                                type="text"
                                                placeholder='16'
                                                pattern='[1-9]\d*'
                                                value={event_round.to_advance || ""}
                                                onChange={(e) => {
                                                    updateEventToAdvance(event.id, index, e.target.value);
                                                }}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    }
                </div>
            ))}
        </div>
    </>
    );
}