"use client";

import { useEffect, useState, useRef, Fragment } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import '@/app/_styles/manage-competition/default.css';
import CompInfoTabEditor from './CompInfoTabEditor';
import CompEventsEditor from './CompEventsEditor';

export default function CreateCompForm({ handleShowDialog }) {
    const [createCompTab, setCreateCompTab] = useState(0);
    const [compName, setCompName] = useState('');
    const [compVenueName, setCompVenueName] = useState(''); // the name of the venue, eg: AEON Mall Long Bien
    const [compVenueAddress, setCompVenueAddress] = useState(''); // the actual address of the venue, eg: 27 Co Linh, Long Bien, Hanoi
    const [compMode, setCompMode] = useState('off'); // online/offline
    const [compOrganiser, setCompOrganiser] = useState(null);
    const [compRegFromDate, setCompRegFromDate] = useState(formatVNLocalISO(new Date()));
    const [compRegTillDate, setCompRegTillDate] = useState(formatVNLocalISO(new Date()));
    const [compFromDate, setCompFromDate] = useState(new Date().toISOString().split("T")[0]);
    const [compTillDate, setCompTillDate] = useState(new Date().toISOString().split("T")[0]);
    const [compCompetitorLimit, setCompCompetitorLimit] = useState(0);
    const [compDates, setCompDates] = useState([]);

    const [compEventRounds, setCompEventRounds] = useState({}); // only store the info about event and its rounds
    const [calendarEvents, setCalendarEvents] = useState([]);
    const calendarRef = useRef(null)

    const [isAddNewActivity, setIsAddNewActivity] = useState(false);
    const [tempNewActivity, setTempNewActivity] = useState('');

    const [compInfoTabs, setCompInfoTabs] = useState([
        {
            name: "Thanh toán lệ phí",
            info_text: ""
        }
    ]);

    function formatVNLocalISO(date) {
        if (!date) return null;
        const adjusted = new Date(date.getTime() - 7 * 60 * 60 * 1000);
        const pad = n => String(n).padStart(2,'0');
        const year = adjusted.getFullYear();
        const month = pad(adjusted.getMonth()+1);
        const day = pad(adjusted.getDate());
        const hour = pad(adjusted.getHours());
        const min = pad(adjusted.getMinutes());
        const sec = pad(adjusted.getSeconds());
        return `${year}-${month}-${day}T${hour}:${min}:${sec}`; // note: no 'Z'
    }

    function getDatesBetween(startDate, endDate) {
        const dates = [];
        let current = new Date(startDate);

        while (current <= new Date(endDate)) {
            dates.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }

        return dates;
    }

    useEffect(() => {
        let dates = getDatesBetween(compFromDate, compTillDate);
        setCompDates(dates);
    }, [compFromDate, compTillDate]);

    useEffect(() => {
        if (calendarRef.current) {
            const calendarApi = calendarRef.current.getApi();

            setTimeout(() => {
                const events = getRoundsToCalendarEvents(compEventRounds);
                setCalendarEvents(events);
                console.log("Now on calendar:", calendarApi.getEvents());
                calendarApi.render();
            }, 0);
        }
    }, [createCompTab]);

    useEffect(() => {
        const initDraggable = () => {
            const containerEl = document.querySelector("#draggable-event-container");
            if (containerEl) {
                const draggableInstance = new Draggable(containerEl, {
                    itemSelector: ".draggable-event",
                    eventData: (eventEl) => ({
                        title: eventEl.innerText,
                        str_id: eventEl.getAttribute("data-str_id")
                    }),
                });
                // console.log("Draggable() instance initialised");

                // const draggableEls = containerEl.querySelectorAll(".draggable-event");
                // console.log("Found draggable elements:", draggableEls);

                return draggableInstance;
            } else {
                // console.warn("#draggable-event-container not found in DOM");
                return null;
            }
        };

        const instance = initDraggable();

        return () => {
            if (instance) {
            instance.destroy();
            console.log("Draggable() instance destroyed");
            }
        };
    }, [createCompTab]);

    const handleSaveCompInfoTabs = (updatedTabs) => {
        setCompInfoTabs(updatedTabs);
    };

    const handleSaveCompEventRounds = (updatedEventRounds) => {
        setCompEventRounds(updatedEventRounds);
    };

    const handleNewActivity = (e) => {
        if (e.key === "Enter") {
            if (!tempNewActivity.trim()) return;

            setCompEventRounds((prev) => {
                const currentList = prev.is_not_round || [];
                const newIndex = currentList.length + 1;

                const updated = {
                    ...prev,
                    is_not_round: [
                    ...currentList,
                    {
                        event_id: null,
                        format_id: null,
                        name: tempNewActivity,
                        from_datetime: null,
                        till_datetime: null,
                        to_advance: null,
                        is_not_round: true,
                        time_limit: null,
                        cutoff: null,
                        next_round: null,
                        str_id: `is_not_round-${newIndex}`,
                    },
                    ],
                };
                console.log(updated);
                return updated;
            });
            setTempNewActivity('');
            setIsAddNewActivity(false);
        }

        if (e.key === "Escape") {
            setTempNewActivity('');
            setIsAddNewActivity(false);
        }
    }

    const handleScheduleRounds = (events) => {
        const scheduled = events.map((event) => ({
            str_id: event._def.extendedProps.str_id,
            start: event._instance.range.start,
            end: event._instance.range.end,
        }));

        setCompEventRounds((prev) => {
            const updated = { ...prev };

            for (let i = 0; i < scheduled.length; i++) {
            const { str_id, start, end } = scheduled[i];
            const event_id = str_id.split("-")[0];

            const from_str = formatVNLocalISO(start);
            const till_str = formatVNLocalISO(end);

            if (updated[event_id]) {
                updated[event_id] = updated[event_id].map((round) =>
                round.str_id === str_id
                    ? { ...round, from_datetime: from_str, till_datetime: till_str }
                    : round
                );
            }
            }

            // console.log(updated);
            return updated;
        });

        return scheduled;
    };

    const getRoundsToCalendarEvents = (rounds) => {
        const events = [];

        Object.entries(rounds).forEach(([eventId, rounds]) => {
            rounds.forEach((round) => {
            events.push({
                id: round.str_id,
                title: round.name || round.str_id,
                start: round.from_datetime,
                end: round.till_datetime,
                extendedProps: {
                    str_id: round.str_id
                }
            });
            });
        });

        return events;
    }

    const handleRemoveCalendarEvent = (str_id) => {
        if (!calendarRef.current) return;
        const calendarApi = calendarRef.current.getApi();

        setTimeout(() => {
            const event = calendarApi.getEvents().find(ev => ev._def.extendedProps.str_id === str_id);
            if (event) event.remove();

            setCompEventRounds((prev) => {
                const updated = { ...prev };
                const event_id = str_id.split("-")[0];

                if (updated[event_id]) {
                    updated[event_id] = updated[event_id].map((round) =>
                        round.str_id === str_id
                            ? { ...round, from_datetime: null, till_datetime: null }
                            : round
                    );
                }

                console.log(updated);
                return updated;
            });
        }, 0);
    };

    return (
        <div className="create-comp-backdrop">
            <div className="create-comp-container" id="create-comp-container">
                <div className='create-comp-tabs-container'>
                    <div className={`create-comp-tab ${createCompTab == 0 ? "open" : ""}`} onClick={() => setCreateCompTab(0)}>1. Thông tin cơ bản</div>
                    <div className={`create-comp-tab ${createCompTab == 1 ? "open" : ""}`} onClick={() => setCreateCompTab(1)}>2. Nội dung</div>
                    <div className={`create-comp-tab ${createCompTab == 2 ? "open" : ""}`} onClick={() => {setCreateCompTab(2); setCalendarEvents(getRoundsToCalendarEvents(compEventRounds))}}>3. Lịch trình</div>
                    <div className={`create-comp-tab ${createCompTab == 3 ? "open" : ""}`} onClick={() => setCreateCompTab(3)}>4. Thêm tab thông tin chi tiết</div>
                </div>

                <div className={`create-comp-box on-tab-${createCompTab}`}>
                    {createCompTab == 0 &&
                    <>
                        <div>
                            <label>Tên cuộc thi</label>
                            <input type="name" value={compName} onChange={(e) => setCompName(e.target.value)} placeholder='AEON Mall Long Biên Open 2025' />
                        </div>
                        <div>
                            <label>Tên địa điểm</label>
                            <input type="name" value={compVenueName} onChange={(e) => setCompVenueName(e.target.value)} placeholder='Hội trường tầng 3, AEON Mall Long Biên' />
                        </div>
                        <div>
                            <label>Địa điểm</label>
                            <input type="text" value={compVenueAddress} onChange={(e) => setCompVenueAddress(e.target.value)} placeholder='27 Cổ Linh, Long Biên, Hà Nội' />
                        </div>
                        <div>
                            <label>Loại hình</label>
                            <select name="compMode" value={compMode} onChange={(e) => setCompMode(e.target.value)}>
                                <option value="off">Trực tiếp</option>
                                <option value="onl">Online</option>
                            </select>
                        </div>
                        <div>
                            <label>Thời hạn đăng ký</label>
                            <input type="datetime-local" value={compRegFromDate} onChange={(e) => setCompRegFromDate(e.target.value)} />
                            -<input type="datetime-local" value={compRegTillDate} onChange={(e) => setCompRegTillDate(e.target.value)} />
                        </div>
                        <div>
                            <label>Ngày diễn ra giải đấu</label>
                            <input type="date" value={compFromDate} onChange={(e) => setCompFromDate(e.target.value)} />
                            -<input type="date" value={compTillDate} onChange={(e) => setCompTillDate(e.target.value)} />
                        </div>
                        <div>
                            <label>Giới hạn số lượng thí sinh</label>
                            <input type="number" value={compCompetitorLimit} onChange={(e) => setCompCompetitorLimit(e.target.value)} placeholder='50' />
                        </div>
                    </>
                    }
                    {createCompTab == 1 &&
                    <>
                        <CompEventsEditor initialRounds={compEventRounds} onSaveAll={handleSaveCompEventRounds} />
                    </>
                    }
                    {createCompTab == 2 &&
                    <>
                    <div id="draggable-event-container">
                        {Object.entries(compEventRounds).map(([eventId, rounds]) => (
                            <Fragment key={eventId}>
                            {rounds.map((round, index) => (
                                <div className={round.from_datetime == null ? 'draggable-event' : 'not-draggable-event'} key={round.str_id} data-str_id={round.str_id}>
                                    <span>{round.name || round.str_id}</span>

                                    {(round.from_datetime != null) &&
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" onClick={() => handleRemoveCalendarEvent(round.str_id)}><path d="M262.2 48C248.9 48 236.9 56.3 232.2 68.8L216 112L120 112C106.7 112 96 122.7 96 136C96 149.3 106.7 160 120 160L520 160C533.3 160 544 149.3 544 136C544 122.7 533.3 112 520 112L424 112L407.8 68.8C403.1 56.3 391.2 48 377.8 48L262.2 48zM128 208L128 512C128 547.3 156.7 576 192 576L448 576C483.3 576 512 547.3 512 512L512 208L464 208L464 512C464 520.8 456.8 528 448 528L192 528C183.2 528 176 520.8 176 512L176 208L128 208zM288 280C288 266.7 277.3 256 264 256C250.7 256 240 266.7 240 280L240 456C240 469.3 250.7 480 264 480C277.3 480 288 469.3 288 456L288 280zM400 280C400 266.7 389.3 256 376 256C362.7 256 352 266.7 352 280L352 456C352 469.3 362.7 480 376 480C389.3 480 400 469.3 400 456L400 280z"/></svg>
                                    }
                                </div>
                            ))}
                            </Fragment>
                        ))}

                        {isAddNewActivity ?
                            <input autoFocus
                                onBlur={() => {
                                    setTempNewActivity('');
                                    setIsAddNewActivity(false);
                                }}
                                onChange={(e) => setTempNewActivity(e.target.value)}
                                onKeyDown={(e) => handleNewActivity(e)}
                            ></input> :
                            <div className='new-activity-button'
                                onClick={() => setIsAddNewActivity(true)}
                            >+</div>
                        }
                    </div>
                    <FullCalendar
                        ref={calendarRef}
                        plugins={[ timeGridPlugin, interactionPlugin ]}
                        initialView='customTimeGridDays'
                        headerToolbar={{ left: '', center: '', right: '' }}
                        dayHeaderFormat={{
                            month: 'long',
                            year: 'numeric',
                            day: 'numeric',
                            weekday: 'long'
                        }}
                        snapDuration={'00:05:00'}
                        slotDuration={'00:15:00'}
                        slotLabelInterval={'00:30:00'}
                        allDaySlot={false}
                        editable={true}
                        droppable={true}
                        // validRange={{ start: compFromDate, end: addOneDay(compTillDate) }} // write addOneDay function if needed
                        timeZone={"local"}
                        locale={'vn'}
                        initialDate={compFromDate}
                        views={{
                            customTimeGridDays: {
                                type: 'timeGrid',
                                duration: { days: compDates.length }
                            }
                        }}
                        slotMinTime="07:00:00"
                        slotMaxTime="21:00:00"
                        events={calendarEvents}
                        eventsSet={(events) => {
                            handleScheduleRounds(events);
                        }}
                    />
                    </>
                    }
                    {createCompTab == 3 &&
                    <CompInfoTabEditor initialTabs={compInfoTabs} onSaveAll={handleSaveCompInfoTabs} />
                    }
                </div>

                <div className="create-comp-footer">
                    <button className="btn-abort" onClick={() => handleShowDialog(false)}>Hủy</button>
                    <button className="btn-submit">Tạo cuộc thi</button>
                </div>
            </div>
        </div>
    );
}