"use client";

import { useEffect, useState, Fragment } from 'react';
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
    const [compRegFromDate, setCompRegFromDate] = useState(toDatetimeLocalInputValue(new Date()));
    const [compRegTillDate, setCompRegTillDate] = useState(toDatetimeLocalInputValue(new Date()));
    const [compFromDate, setCompFromDate] = useState(new Date().toISOString().split("T")[0]);
    const [compTillDate, setCompTillDate] = useState(new Date().toISOString().split("T")[0]);
    const [compCompetitorLimit, setCompCompetitorLimit] = useState(0);
    const [compDates, setCompDates] = useState([]);

    const now = new Date();
    now.setHours(8, 0, 0, 0);
    const next15min = new Date();
    next15min.setHours(8, 15, 0, 0);

    const [compEventRounds, setCompEventRounds] = useState({}); // only store the info about event and its rounds

    const [compEvents, setCompEvents] = useState([
        {
            event_id: null,
            format_id: null,
            name: "Checkin",
            from_datetime: new Date(now),
            till_datetime: new Date(next15min),
            to_advance: null,
            is_not_round: true,
            time_limit: null,
            cutoff: null,
            next_round: null,
            str_id: null
        },
        {
            event_id: '333',
            format_id: 'a',
            name: "3x3x3 vòng 1",
            from_datetime: new Date(now),
            till_datetime: new Date(next15min),
            to_advance: null,
            is_not_round: true,
            time_limit: null,
            cutoff: null,
            next_round: null,
            str_id: null
        }
    ]); // an event's round, or lunch break, or checkin...

    const [CompInfoTab, setCompInfoTab] = useState(0);
    const [compInfoTabs, setCompInfoTabs] = useState([
        {
            name: "Thanh toán lệ phí",
            info_text: ""
        }
    ]);

    function toDatetimeLocalInputValue(date) {
        const d = new Date(date);
        const pad = (n) => (n < 10 ? "0" + n : n);
        return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) + "T" + pad(d.getHours()) + ":" + pad(d.getMinutes());
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

    function addOneDay(dateString) {
        const d = new Date(dateString);
        d.setDate(d.getDate() + 1);
        return d.toISOString();
    }

    useEffect(() => {
        let dates = getDatesBetween(compFromDate, compTillDate);
        setCompDates(dates);
    }, [compFromDate, compTillDate]);

    useEffect(() => {
        const initDraggable = () => {
            const containerEl = document.querySelector("#draggable-event-container");
            if (containerEl) {
                const draggableInstance = new Draggable(containerEl, {
                    itemSelector: ".draggable-event",
                    eventData: (eventEl) => ({
                    title: eventEl.innerText,
                    }),
                });
                // console.log("✅ Draggable() instance initialised");

                // // Debug: list items
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

    const handleChangeEvents = (index, field, value) => {
        setCompEvents(prevEvents =>
            prevEvents.map((ev, i) =>
                i === index ? { ...ev, [field]: value } : ev
            )
        );
    };

    const handleAddEvent = (position) => {
        const blankEvent = {
            event_id: null,
            format_id: null,
            name: "",
            from_datetime: new Date(),
            till_datetime: new Date(),
            to_advance: null,
            is_not_round: true,
            time_limit: null,
            cutoff: null,
            next_round: null
        };

        setCompEvents(prevEvents => {
            const newEvents = [...prevEvents];
            newEvents.splice(position, 0, blankEvent);
            return newEvents;
        });
    };

    const handleDeleteEvent = (index) => {
        setCompEvents((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSaveCompInfoTabs = (updatedTabs) => {
        setCompInfoTabs(updatedTabs);
    };

    const handleSaveCompEventRounds = (updatedEventRounds) => {
        setCompEventRounds(updatedEventRounds);
    };

    function formatLocalISO(date) {
        const pad = (n) => String(n).padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    }

    return (
        <div className="create-comp-backdrop">
            <div className="create-comp-container" id="create-comp-container">
                <div className='create-comp-tabs-container'>
                    <div className={`create-comp-tab ${createCompTab == 0 ? "open" : ""}`} onClick={() => setCreateCompTab(0)}>1. Thông tin cơ bản</div>
                    <div className={`create-comp-tab ${createCompTab == 1 ? "open" : ""}`} onClick={() => setCreateCompTab(1)}>2. Nội dung</div>
                    <div className={`create-comp-tab ${createCompTab == 2 ? "open" : ""}`} onClick={() => setCreateCompTab(2)}>3. Lịch trình</div>
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
                                <div className='draggable-event' key={round.str_id}
                                    style={{
                                        padding: "4px 8px",
                                        margin: "4px 0",
                                        background: "#1976d2",
                                        color: "#fff",
                                        borderRadius: "4px",
                                        cursor: "grab",
                                        userSelect: "none", // 👈 helps dragging
                                    }}
                                >{round.str_id}</div>
                            ))}
                            </Fragment>
                        ))}
                    </div>
                    <FullCalendar
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
                        validRange={{ start: compFromDate, end: addOneDay(compTillDate) }}
                        timeZone="local"
                        initialDate={compFromDate}
                        views={{
                            customTimeGridDays: {
                                type: 'timeGrid',
                                duration: { days: compDates.length }
                            }
                        }}
                        // events={[]}
                        slotMinTime="07:00:00"
                        slotMaxTime="21:00:00"
                        eventsSet={(events) => {
                            console.log(events);
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