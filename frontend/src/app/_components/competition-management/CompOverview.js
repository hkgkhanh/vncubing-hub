"use client";

import { useState, useEffect } from 'react';
import PageNavigation from '../PageNavigation';
import CreateCompForm from './CreateCompForm';
import EditCompForm from './EditCompForm';
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
            console.log(data);

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

    const handlePageChange = async (newPage) => {
        setIsLoadingComps(true);
        const { ok, data, count } = await getManageableComps(newPage);

        if (!ok) alert("Tải trang thất bại, vui lòng thử lại.");
        console.log(data);

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
        </>
    );
}