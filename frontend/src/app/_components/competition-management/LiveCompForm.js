"use client";

import { useEffect, useState, Fragment } from 'react';
import { getRoundsList } from '@/app/handlers/live-comp-management';

export default function LiveCompForm({ handleShowDialog, compId, reload }) {
    const [createCompTab, setCreateCompTab] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdatingResults, setIsUpdatingResults] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [roundsData, setRoundsData] = useState([]);
    const [eventsData, setEventsData] = useState([]);
    const [selectedRound, setSelectedRound] = useState(null);

    useEffect(() => {
        async function fetchCompetitorsList() {
            let data = await getRoundsList(compId);
            if (!data.ok) alert("Lỗi tải trang, vui lòng thử lại.");
            console.log(data);
            setRoundsData(data.data);
            setEventsData(data.comp_events);
            setSelectedRound(data.data[0].string_id);
            setIsLoading(false);
        }
        fetchCompetitorsList();
    }, []);

    const handleRoundChange = (string_id) => {
        setSelectedRound(string_id);
    }

    if (isLoading) return (
        <div className="create-comp-backdrop">
            <div className="create-comp-container spinner-cont-container" id="create-comp-container">
                <div className='spinner-container'>
                    <img
                        src="/ui/spinner.svg"
                        alt="Loading"
                        className="spinner"
                        title="Loading"
                    />
                </div>
            </div>
        </div>
    );

    return (
        <div className="create-comp-backdrop">
            <div className="create-comp-container">
                <div className='create-comp-tabs-container'>
                    <div className={`create-comp-tab ${createCompTab == 0 ? "open" : "close"}`} onClick={() => setCreateCompTab(0)}>Nhập kết quả</div>
                    {/* <div className={`create-comp-tab ${createCompTab == 1 ? "open" : "close"}`} onClick={() => setCreateCompTab(1)}>Xác nhận vòng đấu</div> */}
                </div>

                <div className={`create-comp-box live-comp-manage-box`}>
                    <div className="side-bar">
                        {eventsData.map((event, index) => (
                            <Fragment key={index}>
                            <div key={index} className='event-header'>
                                <img
                                    src={event.is_official
                                        ? `/assets/event_icons/event/${event.event_id}.svg`
                                        : `/assets/event_icons/unofficial/${event.event_id}.svg`
                                    }
                                    alt={event.name}
                                    title={event.name}
                                />
                                {event.name}
                            </div>
                            {roundsData.filter(round => round.event_id === event.event_id).map((round, roundindex) => (
                                <div key={roundindex} className={`event-round ${round.string_id == selectedRound ? 'round-selected' : ''}`} onClick={() => handleRoundChange(round.string_id)}>{round.name}</div>
                            ))}
                            </Fragment>
                        ))}
                    </div>
                    <div>
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Tìm theo ID hoặc tên người chơi"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                        <div className="table-container">
                            <div>
                                <button>Xếp hạng</button>
                                <button>Top vào vòng trong</button>
                            </div>
                            {(() => {
                                const round = roundsData.find(r => r.string_id === selectedRound);
                                if (!round) return <div>Không tìm thấy vòng đấu</div>;

                                // 🔎 filter competitors
                                const filteredCompetitors = round.competitors.filter(c =>
                                    c.person_id.toString().includes(searchTerm) ||
                                    c.person_name.toLowerCase().includes(searchTerm.toLowerCase())
                                );

                                return (
                                    <table className='live-result-manage-table'>
                                        <thead>
                                            <tr>
                                                <td></td>
                                                <td className='align-left'>ID</td>
                                                <td className='align-left'>Họ tên</td>
                                                <td className='align-right'>#1</td>
                                                <td className='align-right'>#2</td>
                                                <td className='align-right'>#3</td>
                                                <td className='align-right'>#4</td>
                                                <td className='align-right'>#5</td>
                                                <td className='align-right'>Đơn</td>
                                                <td className='align-right'>Trung bình</td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredCompetitors.map((c, idx) => (
                                                <tr key={idx}>
                                                    <td>
                                                        <input type='checkbox' title='Vào vòng trong?' />
                                                    </td>
                                                    <td className='align-left'>{c.person_id}</td>
                                                    <td className='align-left'>{c.person_name}</td>
                                                    {c.results.map((res, rIdx) => (
                                                        <td key={rIdx} className='align-right'>{res}</td>
                                                    ))}
                                                    <td className='align-right'>0</td>
                                                    <td className='align-right'>0</td>
                                                </tr>
                                            ))}
                                            {filteredCompetitors.length === 0 && (
                                                <tr>
                                                    <td colSpan={10} className="align-center">
                                                        Không có kết quả phù hợp
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                );
                            })()}
                        </div>
                    </div>
                </div>

                <div className="create-comp-footer">
                    <button className="btn-abort" onClick={() => handleShowDialog(false)}>Đóng</button>
                    <button className="btn-submit" onClick={() => handleShowDialog(false)} disabled={isUpdatingResults}>{!isUpdatingResults ? "Lưu" : "Đang lưu..."}</button>
                </div>
            </div>
        </div>
    );
}