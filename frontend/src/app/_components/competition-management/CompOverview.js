"use client";

import { useState, useEffect } from 'react';
import PageNavigation from '../PageNavigation';
import CreateCompForm from './CreateCompForm';
import EditCompForm from './EditCompForm';
import LiveCompForm from './LiveCompForm';
import LiveCompConfirmForm from './LiveCompConfirmForm';
import { getManageableComps, getCompRounds, getCompInfoTabs } from '@/app/handlers/competition-management';

export default function CompOverview() {
    const [isLoginOrganiser, setIsLoginOrganiser] = useState(true);
    const [showNewCompDialog, setShowNewCompDialog] = useState(false);
    const [showEditCompDialog, setShowEditCompDialog] = useState(false);
    const [compsData, setCompsData] = useState([]);
    const [compsCount, setCompsCount] = useState(0);
    const [pageData, setPageData] = useState(null);
    const [isLoadingComps, setIsLoadingComps] = useState(true);
    const [isLoadingEditCompDialog, setIsLoadingEditCompDialog] = useState(false);
    const [selectedEditCompData, setSelectedEditCompData] = useState(null);
    const [showLiveCompDialog, setShowLiveCompDialog] = useState(false);
    const [showLiveCompConfirmDialog, setShowLiveCompConfirmDialog] = useState(false);
    const [selectedLiveCompId, setSelectedLiveCompId] = useState(null);

    function formatDate(input) {
        if (input.includes("T")) {
            const date = new Date(input);
            const pad = (n) => n.toString().padStart(2, "0");

            const hh = pad(date.getHours());
            const mm = pad(date.getMinutes());
            const ss = pad(date.getSeconds());
            const dd = pad(date.getDate());
            const MM = pad(date.getMonth() + 1);
            const yyyy = date.getFullYear();

            return `${hh}:${mm}:${ss} ${dd}/${MM}/${yyyy}`;
        } else {
            const date = new Date(input);
            const pad = (n) => n.toString().padStart(2, "0");

            const dd = pad(date.getDate());
            const MM = pad(date.getMonth() + 1);
            const yyyy = date.getFullYear();

            return `${dd}/${MM}/${yyyy}`;
        }
    }

    useEffect(() => {
        async function fetchComps() {
            setIsLoadingComps(true);
            const { ok, data, count } = await getManageableComps(1);

            if (!ok) alert("Tải trang thất bại, vui lòng thử lại.");
            // console.log(data);

            setCompsData(data);
            setCompsCount(count);
            const size = data.length || 1;
            setPageData({
                page: 1,
                pageTotal: count > 0 ? Math.ceil(count / size) : 1,
                size: data.length,
                total: count
            });
            setIsLoadingComps(false);
        }
        fetchComps();
    }, []);

    useEffect(() => {
        async function fetchComps() {
            setIsLoadingComps(true);
            const { ok, data, count } = await getManageableComps(1);

            if (!ok) alert("Tải trang thất bại, vui lòng thử lại.");
            // console.log(data);

            setCompsData(data);
            setCompsCount(count);
            const size = data.length || 1;
            setPageData({
                page: 1,
                pageTotal: count > 0 ? Math.ceil(count / size) : 1,
                size: data.length,
                total: count
            });
            setIsLoadingComps(false);
        }
        fetchComps();
    }, [showNewCompDialog, showEditCompDialog]);

    const handlePageChange = async (newPage) => {
        setIsLoadingComps(true);
        const { ok, data, count } = await getManageableComps(newPage);

        if (!ok) alert("Tải trang thất bại, vui lòng thử lại.");
        // console.log(data);

        setCompsData(data);
        setCompsCount(count);
        const size = data.length || 1;
        setPageData({
            page: 1,
            pageTotal: count > 0 ? Math.ceil(count / size) : 1,
            size: data.length,
            total: count
        });
        setIsLoadingComps(false);
    };

    const handleShowEditCompDialog = async (comp_id) => {
        setIsLoadingEditCompDialog(true);
        let compData = null;
        for (let i = 0; i < compsData.length; i++) {
            if (compsData[i].id == comp_id) {
                compData = compsData[i];
                break;
            }
        }
        const compRounds = await getCompRounds(comp_id);
        const compInfoTabs = await getCompInfoTabs(comp_id);

        const groupedRounds = compRounds.data.reduce((acc, item) => {
            const key = item.event_id ?? "is_not_round";

            const { string_id, next_round, ...rest } = item;
            const newItem = { ...rest, str_id: string_id.split("-").slice(1).join("-"), next_round: next_round ? next_round.split("-").slice(1).join("-") : null };

            if (!acc[key]) acc[key] = [];
            acc[key].push(newItem);

            return acc;
        }, {});

        const dates = [];
        let current = new Date(compData.from_date);

        while (current <= new Date(compData.from_date)) {
            dates.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }

        const calendar_events = [];

        compData = { ...compData, dates: dates, calendar_events: calendar_events, rounds: groupedRounds, info_tabs: compInfoTabs.data };
        // console.log(compData);

        setSelectedEditCompData(compData);
        setShowEditCompDialog(true);
        setIsLoadingEditCompDialog(false);
    }

    const handleShowLiveCompDialog = async (comp_id) => {
        setSelectedLiveCompId(comp_id);
        setShowLiveCompDialog(true);
    }

    const handleShowLiveCompConfirmDialog = async (comp_id) => {
        setSelectedLiveCompId(comp_id);
        setShowLiveCompConfirmDialog(true);
    }

    return (
        <>
        <div className="competition-manage-box">
            <h3>Cuộc thi</h3>

            {isLoadingComps ? (
            <div className='spinner-container'>
                <img
                    src="/ui/spinner.svg"
                    alt="Loading"
                    className="spinner"
                    title="Loading"
                />
            </div>) : (
            <>
            <div className="search-box">
                <input type="text" placeholder="Nhập tên cuộc thi..." />
                <button onClick={() => setShowNewCompDialog(true)}>Tạo cuộc thi</button>
            </div>

            <div className="table-container">
                { compsCount > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <td>ID</td>
                                <td>Cuộc thi</td>
                                <td>Hạn đăng ký</td>
                                <td>Ngày diễn ra</td>
                                <td>Hành động</td>
                            </tr>
                        </thead>
                        <tbody>
                            {compsData.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.id}</td>
                                    <td>{item.name}</td>
                                    <td>{formatDate(item.registration_till_date)}</td>
                                    <td>{`${formatDate(item.from_date)} - ${formatDate(item.till_date)}`}</td>
                                    <td>
                                        <svg role="img" aria-label="[title]" onClick={() => handleShowEditCompDialog(item.id)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M535.6 85.7C513.7 63.8 478.3 63.8 456.4 85.7L432 110.1L529.9 208L554.3 183.6C576.2 161.7 576.2 126.3 554.3 104.4L535.6 85.7zM236.4 305.7C230.3 311.8 225.6 319.3 222.9 327.6L193.3 416.4C190.4 425 192.7 434.5 199.1 441C205.5 447.5 215 449.7 223.7 446.8L312.5 417.2C320.7 414.5 328.2 409.8 334.4 403.7L496 241.9L398.1 144L236.4 305.7zM160 128C107 128 64 171 64 224L64 480C64 533 107 576 160 576L416 576C469 576 512 533 512 480L512 384C512 366.3 497.7 352 480 352C462.3 352 448 366.3 448 384L448 480C448 497.7 433.7 512 416 512L160 512C142.3 512 128 497.7 128 480L128 224C128 206.3 142.3 192 160 192L256 192C273.7 192 288 177.7 288 160C288 142.3 273.7 128 256 128L160 128z"/><title>Chỉnh sửa</title></svg>
                                        <svg role="img" aria-label="[title]" onClick={() => handleShowLiveCompDialog(item.id)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M160 96C124.7 96 96 124.7 96 160L96 480C96 515.3 124.7 544 160 544L480 544C515.3 544 544 515.3 544 480L544 160C544 124.7 515.3 96 480 96L160 96zM216 288C229.3 288 240 298.7 240 312L240 424C240 437.3 229.3 448 216 448C202.7 448 192 437.3 192 424L192 312C192 298.7 202.7 288 216 288zM400 376C400 362.7 410.7 352 424 352C437.3 352 448 362.7 448 376L448 424C448 437.3 437.3 448 424 448C410.7 448 400 437.3 400 424L400 376zM320 192C333.3 192 344 202.7 344 216L344 424C344 437.3 333.3 448 320 448C306.7 448 296 437.3 296 424L296 216C296 202.7 306.7 192 320 192z"/><title>Kết quả trực tiếp</title></svg>
                                        <svg role="img" aria-label="[title]" onClick={() => handleShowLiveCompConfirmDialog(item.id)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M384 64C366.3 64 352 78.3 352 96C352 113.7 366.3 128 384 128L466.7 128L265.3 329.4C252.8 341.9 252.8 362.2 265.3 374.7C277.8 387.2 298.1 387.2 310.6 374.7L512 173.3L512 256C512 273.7 526.3 288 544 288C561.7 288 576 273.7 576 256L576 96C576 78.3 561.7 64 544 64L384 64zM144 160C99.8 160 64 195.8 64 240L64 496C64 540.2 99.8 576 144 576L400 576C444.2 576 480 540.2 480 496L480 416C480 398.3 465.7 384 448 384C430.3 384 416 398.3 416 416L416 496C416 504.8 408.8 512 400 512L144 512C135.2 512 128 504.8 128 496L128 240C128 231.2 135.2 224 144 224L224 224C241.7 224 256 209.7 256 192C256 174.3 241.7 160 224 160L144 160z"/><title>Xác nhận kết quả</title></svg>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="no-result">
                        Không có cuộc thi.
                    </div>
                )}
                
            </div>

            <PageNavigation pageData={pageData} onPageChange={handlePageChange} />
            </>
            )}   
        </div>

        {showNewCompDialog && (
            <CreateCompForm handleShowDialog={setShowNewCompDialog} />
        )}

        {isLoadingEditCompDialog && (
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
        )}

        {showEditCompDialog && (
            <EditCompForm handleShowDialog={setShowEditCompDialog} compData={selectedEditCompData} reload={handlePageChange} />
        )}

        {showLiveCompDialog && (
            <LiveCompForm handleShowDialog={setShowLiveCompDialog} compId={selectedLiveCompId} reload={handlePageChange} />
        )}

        {showLiveCompConfirmDialog && (
            <LiveCompConfirmForm handleShowDialog={setShowLiveCompConfirmDialog} compId={selectedLiveCompId} reload={handlePageChange} />
        )}
        </>
    );
}