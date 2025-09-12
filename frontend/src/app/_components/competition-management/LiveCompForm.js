"use client";

import { useEffect, useState, Fragment } from 'react';
import { getRoundsList, sendSolveToTempResults, sendToNextRound, sendTopToAdvanceToNextRound, endRound, createNextRoundCompetitors } from '@/app/handlers/live-comp-management';
import { calcResult, compareResults } from '@/app/lib/stats';
import TimeInputDiv from '../TimeInputDiv';

export default function LiveCompForm({ handleShowDialog, compId, reload }) {
    const [createCompTab, setCreateCompTab] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isSorting, setIsSorting] = useState(false);
    const [isSendingTopToAdvance, setIsSendingTopToAdvance] = useState(false);
    const [isEndingRound, setIsEndingRound] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [roundsData, setRoundsData] = useState([]);
    const [eventsData, setEventsData] = useState([]);
    const [selectedRound, setSelectedRound] = useState(null);

    const solvesCountByFormat = {
        "1": 1,
        "2": 2,
        "3": 3,
        "5": 5,
        "a": 5,
        "m": 3
    };

    function timeValueToString(time_value) {
        if (time_value == -1) return "DNF";
        if (time_value == -2) return "DNS";

        let result = '';
        if (time_value == null || isNaN(time_value) || time_value == 0) return "0";

        let minutes = Math.floor(time_value / 6000); // 6000 cs = 60s = 1m
        let seconds = Math.floor((time_value % 6000) / 100);
        let centis  = time_value % 100;

        if (minutes > 0) {
            result += `${minutes}:${seconds.toString().padStart(2, "0")}.${centis.toString().padStart(2, "0")}`;
        } else {
            result += `${seconds}.${centis.toString().padStart(2, "0")}`;
        }

        return result;
    }

    useEffect(() => {
        async function fetchCompetitorsList() {
            let data = await getRoundsList(compId);
            if (!data.ok) alert("Lỗi tải trang, vui lòng thử lại.");
            // console.log(data);
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

    const handleUpdateSolveResult = (round_string_id, person_id, solve_index, newVal) => {
        setRoundsData(prev => {
            const updatedRounds = prev.map(round => {
                if (round.string_id !== round_string_id) return round;

                return {
                    ...round,
                    competitors: round.competitors.map(c => {
                        if (c.person_id !== person_id) return c;

                        const updatedResults = [...c.results];
                        updatedResults[solve_index] = newVal;
                        // console.log(round_string_id, person_id, solve_index, newVal);
                        sendSolveToTempResults(round.id, person_id, solve_index, newVal)
                        .then(res => {
                            if (!res.ok) alert("Có lỗi xảy ra, vui lòng tải lại trang và thử lại.");
                        })
                        .catch(err => alert("Có lỗi xảy ra, vui lòng tải lại trang và thử lại."));

                        return { ...c, results: updatedResults };
                    })
                };
            });

            // console.log("Updated roundsData:", updatedRounds);
            return updatedRounds;
        });
    };

    const handleSendToNextRound = (round_string_id, person_id, checked) => {
        setRoundsData(prev => prev.map(round => {
            if (round.string_id !== round_string_id) return round;

            sendToNextRound(round.id, person_id, checked)
                .then(res => {
                    if (!res.ok) alert("Có lỗi xảy ra, vui lòng thử lại.")
                })
                .catch(() => alert("Có lỗi xảy ra, vui lòng thử lại."));

            return {
                ...round,
                competitors: round.competitors.map(comp =>
                comp.person_id !== person_id
                    ? comp
                    : { ...comp, to_next_round: checked }
                )
            };
        }));
    };

    const handleSortRoundRanking = (round_id) => {
        setIsSorting(true);
        setTimeout(() => {
            setRoundsData(prev =>
                prev.map(r => {
                    if (r.id !== round_id) return r;

                    const updatedCompetitors = r.competitors.map(c => {
                        const { bestNumber, avgNumber } = calcResult(c.results, r.format_id);
                        return { ...c, best: bestNumber, avg: avgNumber };
                    });

                    return {
                        ...r,
                        competitors: [...updatedCompetitors].sort((a, b) =>
                            compareResults(a, b, r.format_id)
                        )
                    };
                })
            );
            setIsSorting(false);
        }, 0);
    };

    const handleSendTopToAdvanceToNextRound = (round_id) => {
        setIsSendingTopToAdvance(true);

        setTimeout(() => {
            setRoundsData(prev =>
                prev.map(r => {
                    if (r.id !== round_id) return r;

                    const updatedCompetitors = r.competitors.map(c => {
                        const { bestNumber, avgNumber } = calcResult(c.results, r.format_id);
                        return { ...c, best: bestNumber, avg: avgNumber };
                    });

                    // Sort competitors
                    const sorted = [...updatedCompetitors].sort((a, b) =>
                        compareResults(a, b, r.format_id)
                    );

                    // Assign rank (ties get the same rank)
                    let currentRank = 1;
                    const ranked = sorted.map((c, index) => {
                        if (index > 0 && compareResults(c, sorted[index - 1], r.format_id) === 0) {
                            return { ...c, rank: currentRank };
                        } else {
                            const newRank = index + 1;
                            currentRank = newRank;
                            return { ...c, rank: newRank };
                        }
                    });

                    // Mark top X competitors as advancing
                    const toAdvance = r.to_advance ?? 0;
                    const finalCompetitors = ranked.map((c, index) => ({
                        ...c,
                        to_next_round: c.rank <= toAdvance
                    }));

                    sendTopToAdvanceToNextRound(r.id, finalCompetitors)
                        .then(res => {
                            if (!res.ok) alert("Có lỗi xảy ra, vui lòng thử lại.")
                        })
                        .catch(() => alert("Có lỗi xảy ra, vui lòng thử lại."));

                    return {
                        ...r,
                        competitors: finalCompetitors
                    };
                })
            );

            setIsSendingTopToAdvance(false);
        }, 0);
    };


    const handleEndRound = (round_id) => {
        if (!confirm("Bạn vẫn sẽ có thể thay đổi kết quả của vòng đấu này, nhưng không thể thay đổi danh sách thí sinh tham dự vòng sau.")) return;

        setIsEndingRound(true);

        const currentRound = roundsData.find(r => r.id === round_id);

        endRound(round_id)
            .then(res => {
                if (!res.ok) alert("Có lỗi xảy ra, vui lòng thử lại.")
            })
            .catch(() => alert("Có lỗi xảy ra, vui lòng thử lại."));

        setTimeout(() => {
            setRoundsData(prev =>
                prev.map(r => {
                    if (r.id === round_id) return {
                        ...r,
                        operation_status: 1
                    };

                    if (r.string_id !== currentRound.next_round) return r;

                    let competitorsForNextRound = [];
                    for (let i = 0; i < currentRound.competitors.length; i++) {
                        if (currentRound.competitors[i].to_next_round) {
                            competitorsForNextRound.push({
                                person_id: currentRound.competitors[i].person_id,
                                person_name: currentRound.competitors[i].person_name,
                                results: [0, 0, 0, 0, 0]
                            })
                        }
                    }

                    createNextRoundCompetitors(r.id, competitorsForNextRound)
                        .then(res => {
                            if (!res.ok) alert("Có lỗi xảy ra, vui lòng thử lại.")
                        })
                        .catch(() => alert("Có lỗi xảy ra, vui lòng thử lại."));

                    return {
                        ...r,
                        competitors: [...competitorsForNextRound].sort((a, b) =>
                            compareResults(a, b, r.format_id)
                        )
                    };
                })
            );
            setIsEndingRound(false);
        }, 0);
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
                        <div className='buttons-container'>
                            {(() => {
                                const round = roundsData.find(r => r.string_id === selectedRound);
                                if (!round) return <div>Không tìm thấy vòng đấu</div>;

                                if (round.operation_status == 0) return (
                                    <>
                                    <button className="round-btn-submit" onClick={() => handleSortRoundRanking(round.id)} disabled={isSorting}>{"Xếp hạng"}</button>
                                    {round.next_round != null && 
                                        <button className="round-btn-submit" onClick={() => handleSendTopToAdvanceToNextRound(round.id)} disabled={isSendingTopToAdvance}>{`Top ${round.to_advance}`}</button>
                                    }
                                    <button className="danger" onClick={() => handleEndRound(round.id)} disabled={isEndingRound}>{"Kết thúc vòng đấu"}</button>
                                    </>
                                );
                                else return (
                                    <div>Vòng đấu đã kết thúc.</div>
                                );
                            })()}
                        </div>
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
                            <div>Kết quả DNF nhập -1, kết quả DNS nhập -2, thời gian nhập theo format MMssmm giống csTimer (không cần dấu : và .).</div>
                            {(() => {
                                const round = roundsData.find(r => r.string_id === selectedRound);
                                if (!round) return <div>Không tìm thấy vòng đấu</div>;

                                const solvesCount = solvesCountByFormat[round.format_id];

                                const filteredCompetitors = round.competitors.filter(c =>
                                    c.person_id.toString() === searchTerm ||
                                    c.person_name.toLowerCase().includes(searchTerm.toLowerCase())
                                );

                                const competitorsToNextRound = round.competitors.filter(c => c.to_next_round == true);

                                return (
                                    <table className='live-result-manage-table'>
                                        <thead>
                                            <tr>
                                                <td className='align-center'>{round.to_advance ? `${competitorsToNextRound.length}/${round.to_advance}` : ''}</td>
                                                <td className='align-left'>ID</td>
                                                <td className='align-left'>Họ tên</td>
                                                <td className='align-right'>1</td>
                                                {!(["1"].includes(round.format_id)) && (
                                                        <td className='align-right'>2</td>
                                                )}
                                                {!(["1", "2"].includes(round.format_id)) && (
                                                        <td className='align-right'>3</td>
                                                )}
                                                {!(["1", "2", "3", "m"].includes(round.format_id)) && (
                                                    <>
                                                        <td className='align-right'>4</td>
                                                        <td className='align-right'>5</td>
                                                    </>
                                                )}
                                                <td className='align-right'>Đơn</td>
                                                <td className='align-right'>Avg</td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredCompetitors.map((c, idx) => (
                                                <tr key={idx}>
                                                    <td className='align-left'>
                                                        <input
                                                            type="checkbox"
                                                            title="Vào vòng trong?"
                                                            checked={c.to_next_round || false}
                                                            onChange={(e) =>
                                                                handleSendToNextRound(selectedRound, c.person_id, e.target.checked)
                                                            }
                                                        />
                                                    </td>
                                                    <td className='align-left'>{c.person_id}</td>
                                                    <td className='align-left'>{c.person_name}</td>
                                                    {c.results.slice(0, solvesCount).map((res, rIdx) => (
                                                        <td key={`${selectedRound}-${c.person_id}-${rIdx}`} className='align-right'>
                                                            <TimeInputDiv
                                                                initialValue={timeValueToString(res)}
                                                                initialTimeValue={res}
                                                                className={"time-input"}
                                                                id={`${selectedRound}-${c.person_id}-${rIdx}`}
                                                                onChange={(newVal) =>
                                                                    handleUpdateSolveResult(selectedRound, c.person_id, rIdx, newVal)
                                                                }
                                                            />
                                                        </td>
                                                    ))}
                                                    <td className='align-right'>{calcResult(c.results, round.format_id).bestString}</td>
                                                    <td className='align-right'>{calcResult(c.results, round.format_id).avgString}</td>
                                                </tr>
                                            ))}
                                            {filteredCompetitors.length === 0 && (
                                                <tr>
                                                    <td colSpan={solvesCount + 5} className="align-center">
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
                    {/* <button className="btn-submit" onClick={() => handleShowDialog(false)} disabled={isUpdatingResults}>{!isUpdatingResults ? "Lưu" : "Đang lưu..."}</button> */}
                </div>
            </div>
        </div>
    );
}