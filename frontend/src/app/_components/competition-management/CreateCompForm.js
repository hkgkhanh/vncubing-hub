"use client";

import { useState, Fragment } from 'react';
// import FullCalendar from '@fullcalendar/react';
// import timeGridPlugin from '@fullcalendar/timegrid';
import '@/app/_styles/manage-competition/default.css';
import CompInfoTabEditor from './CompInfoTabEditor';

export default function CreateCompForm({ handleShowDialog }) {
    const [createCompTab, setCreateCompTab] = useState(0);
    const [compName, setCompName] = useState('');
    const [compVenueName, setCompVenueName] = useState(''); // the name of the venue, eg: AEON Mall Long Bien
    const [compVenueAddress, setCompVenueAddress] = useState(''); // the actual address of the venue, eg: 27 Co Linh, Long Bien, Hanoi
    const [compMode, setCompMode] = useState('off'); // online/offline
    const [compOrganiser, setCompOrganiser] = useState(null);
    const [compRegFromDate, setCompRegFromDate] = useState('');
    const [compRegTillDate, setCompRegTillDate] = useState('');
    const [compFromDate, setCompFromDate] = useState('');
    const [compTillDate, setCompTillDate] = useState('');
    const [compCompetitorLimit, setCompCompetitorLimit] = useState(0);

    const now = new Date();
    now.setHours(8, 0, 0, 0);
    const next15min = new Date();
    next15min.setHours(8, 15, 0, 0);

    const [compEvents, setCompEvents] = useState([
        {
            event_id: null,
            format_id: null,
            name: "Checkin",
            from_datetime: new Date(now),
            till_datetime: new Date(next15min),
            competitors_limit: null,
            is_not_round: true,
            time_limit: null,
            is_final: false
        },
        {
            event_id: '333',
            format_id: 'a',
            name: "3x3x3 vòng 1",
            from_datetime: new Date(now),
            till_datetime: new Date(next15min),
            competitors_limit: null,
            is_not_round: false,
            time_limit: 60,
            is_final: false
        }
    ]); // an event's round, or lunch break, or checkin...

    const [CompInfoTab, setCompInfoTab] = useState(0);
    const [compInfoTabs, setCompInfoTabs] = useState([
        {
            name: "Thanh toán lệ phí",
            info_text: ""
        }
    ]);


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
            competitors_limit: null,
            is_not_round: true,
            time_limit: null,
            is_final: false
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

    function formatLocalISO(date) {
        const pad = (n) => String(n).padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    }

    return (
        <div className="create-comp-backdrop">
            <div className="create-comp-container" id="create-comp-container">
                <div className='create-comp-tabs-container'>
                    <div className={`create-comp-tab ${createCompTab == 0 ? "open" : ""}`} onClick={() => setCreateCompTab(0)}>1. Thông tin cơ bản</div>
                    {/* <div className={`create-comp-tab ${createCompTab == 1 ? "open" : ""}`} onClick={() => setCreateCompTab(1)}>2. Nội dung</div> */}
                    <div className={`create-comp-tab ${createCompTab == 2 ? "open" : ""}`} onClick={() => setCreateCompTab(2)}>3. Lịch trình</div>
                    <div className={`create-comp-tab ${createCompTab == 3 ? "open" : ""}`} onClick={() => setCreateCompTab(3)}>4. Thêm tab thông tin chi tiết</div>
                </div>

                <div className="create-comp-box">
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

                    </>
                    }
                    {createCompTab == 2 &&
                    <>
                        {/* <FullCalendar
                            plugins={[ timeGridPlugin ]}
                            initialView='timeGridFourDay'
                            views={{
                                timeGridFourDay: {
                                type: 'timeGrid',
                                duration: { days: 4 }
                                }
                            }}
                            events={[
                                { title: 'event 1', start: '2025-08-12T10:00:00', end: '2025-08-12T12:00:00' },
                                { title: 'event 2', start: '2025-08-13T14:00:00', end: '2025-08-13T15:30:00' }
                            ]}
                            slotMinTime="07:00:00"
                            slotMaxTime="20:00:00"
                        /> */}
                        {compEvents.map((event, index) => (
                        <Fragment key={index}>
                            {/* Add button before each event */}
                            <div className='add-event-segment' onClick={() => handleAddEvent(index)}><span>Thêm</span></div>

                            <div className="event-segment-box">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" onClick={(e) => handleDeleteEvent(index)}><path d="M262.2 48C248.9 48 236.9 56.3 232.2 68.8L216 112L120 112C106.7 112 96 122.7 96 136C96 149.3 106.7 160 120 160L520 160C533.3 160 544 149.3 544 136C544 122.7 533.3 112 520 112L424 112L407.8 68.8C403.1 56.3 391.2 48 377.8 48L262.2 48zM128 208L128 512C128 547.3 156.7 576 192 576L448 576C483.3 576 512 547.3 512 512L512 208L464 208L464 512C464 520.8 456.8 528 448 528L192 528C183.2 528 176 520.8 176 512L176 208L128 208zM288 280C288 266.7 277.3 256 264 256C250.7 256 240 266.7 240 280L240 456C240 469.3 250.7 480 264 480C277.3 480 288 469.3 288 456L288 280zM400 280C400 266.7 389.3 256 376 256C362.7 256 352 266.7 352 280L352 456C352 469.3 362.7 480 376 480C389.3 480 400 469.3 400 456L400 280z"/></svg>
                            <div>
                                <label>Tên</label>
                                <input
                                type="text"
                                value={event.name}
                                placeholder='3x3x3 vòng 1'
                                onChange={(e) => handleChangeEvents(index, 'name', e.target.value)}
                                />
                            </div>

                            <div>
                                <label>Thời gian</label>
                                <input
                                type="datetime-local"
                                value={formatLocalISO(event.from_datetime)}
                                onChange={(e) => handleChangeEvents(index, 'from_datetime', new Date(e.target.value))}
                                />
                                -
                                <input
                                type="datetime-local"
                                value={formatLocalISO(event.till_datetime)}
                                onChange={(e) => handleChangeEvents(index, 'till_datetime', new Date(e.target.value))}
                                />
                            </div>

                            <div>
                                <input
                                type="checkbox"
                                checked={!event.is_not_round}
                                onChange={(e) => handleChangeEvents(index, 'is_not_round', !e.target.checked)}
                                />
                                <label>Là vòng thi đấu?</label>
                            </div>

                            {!event.is_not_round && (
                                <>
                                <div>
                                    <input
                                    type="checkbox"
                                    checked={event.is_final}
                                    onChange={(e) => handleChangeEvents(index, 'is_final', e.target.checked)}
                                    />
                                    <label>Là vòng chung kết?</label>
                                </div>

                                <div>
                                    <label>Nội dung</label>
                                    <select
                                    value={event.event_id}
                                    onChange={(e) => handleChangeEvents(index, 'event_id', e.target.value)}
                                    >
                                    <option value="333">3x3x3</option>
                                    <option value="222">2x2x2</option>
                                    </select>
                                </div>

                                <div>
                                    <label>Thể thức</label>
                                    <select
                                    value={event.format_id}
                                    onChange={(e) => handleChangeEvents(index, 'format_id', e.target.value)}
                                    >
                                    <option value="a">average of 5</option>
                                    <option value="m">mean of 3</option>
                                    <option value="1">best of 1</option>
                                    <option value="2">best of 2</option>
                                    <option value="3">best of 3</option>
                                    </select>
                                </div>

                                <div>
                                    <label>Số lượng thí sinh vào vòng sau</label>
                                    <input
                                    type="number"
                                    value={event.competitors_limit ?? ''}
                                    onChange={(e) => handleChangeEvents(index, 'competitors_limit', e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label>Giới hạn thời gian (cutoff) (giây)</label>
                                    <input
                                    type="number"
                                    value={event.time_limit ?? ''}
                                    onChange={(e) => handleChangeEvents(index, 'time_limit', e.target.value)}
                                    />
                                </div>
                                </>
                            )}
                            </div>
                        </Fragment>
                        ))}
                        <div className='add-event-segment' onClick={() => handleAddEvent(compEvents.length)}><span>Thêm</span></div>
                    </>
                    }
                    {createCompTab == 3 &&
                    // <>
                    //     <div className='create-comp-tabs-container'>
                    //         {compInfoTabs.map((tab, index) => (
                    //             <div key={index} className={`create-comp-tab comp-info-tab ${createCompTab == 0 ? "open" : ""}`} onClick={() => setCompInfoTab(index)}>{tab.name}</div>
                    //         ))}
                    //         <div className={`create-comp-tab comp-info-tab ${createCompTab == 0 ? "open" : ""}`}>Thêm</div>
                    //     </div>

                    //     <CompInfoTabEditor dataIndex={CompInfoTab} onSave={handleSaveInfoTab} />
                    // </>
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