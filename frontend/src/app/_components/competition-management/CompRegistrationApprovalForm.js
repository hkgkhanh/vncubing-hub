"use client";

import { useEffect, useState, useRef, Fragment } from 'react';
import '@/app/_styles/manage-competition/default.css';
import { getCompRegistrationDataByCompId, updateRegistration } from '@/app/handlers/competition-management';

export default function CompRegistrationApprovalForm({ handleSetIsLoadingRegistrationDetails, handleShowDialog, data }) {
    const [statusTypeTab, setStatusTypeTab] = useState(0);
    const [isUpdating, setIsUpdating] = useState(false);
    const [registrationData, setRegistrationData] = useState([]);
    const [onloadRegistrationData, setOnloadRegistrationData] = useState({
        0: [],
        1: [],
        2: [],
        3: []
    });

    function formatGender(g) {
        if (g == 'm') return "Nam";
        if (g == 'f') return "Nữ";
        return "Khác";
    }

    function formatDob(dob) {
        let parts = dob.split("-");
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }

    function formatTimestamp(timestamp) {
        let parts = timestamp.split("T");
        let date_parts = parts[0].split("-");
        return `${parts[1]} ${date_parts[2]}/${date_parts[1]}/${date_parts[0]}`;
    }

    useEffect(() => {
        async function fetchRegistrationDetails() {
            handleSetIsLoadingRegistrationDetails(true);
            const response = await getCompRegistrationDataByCompId(data.comp_id);

            if (!response.ok) alert("Tải trang thất bại, vui lòng thử lại.");
            console.log(response.data);

            setOnloadRegistrationData(prev => {
                const updated = {
                    0: [],
                    1: [],
                    2: [],
                    3: []
                };

                response.data.forEach(item => {
                    const status = item.status;
                    if (!updated[status]) updated[status] = []; // just in case
                    updated[status] = [...updated[status], item];
                });

                return updated;
            });
            setRegistrationData(response.data);
            handleSetIsLoadingRegistrationDetails(false);
        }
        fetchRegistrationDetails();
    }, []);


    const handleUpdateRegistration = async () => {
        try {
            setIsUpdating(true);
            
            let newRegistrations = [];

            for (let key = 0; key < 4; key++) {
                for (let i = 0; i < onloadRegistrationData[key].length; i++) {
                    newRegistrations.push({
                        id: onloadRegistrationData[key][i].id,
                        status: onloadRegistrationData[key][i].status
                    });
                }
            }

            const result = await updateRegistration({ registration: newRegistrations });
            if (!result.ok) alert("Lỗi cập nhật đơn đăng ký, vui lòng thử lại.");
        }
        catch (e) {
            console.log(e);
        }
        finally {
            handleShowDialog(false);
            setIsUpdating(false);
        }
    }

    const handleOnChangeStatus = (newStatus, statusType, id) => {
        setOnloadRegistrationData(prev => {
            return {
                ...prev,
                [statusType]: prev[statusType].map(item =>
                    item.id === id ? { ...item, status: parseInt(newStatus) } : item
                )
            };
        });
    };

    return (
        <div className="create-comp-backdrop">
            <div className="create-comp-container" id="create-comp-container">
                <div className='create-comp-tabs-container'>
                    <div className={`create-comp-tab ${statusTypeTab == 1 ? "open" : "close"}`} onClick={() => setStatusTypeTab(1)}>{`Đã duyệt (${onloadRegistrationData[1].length})`}</div>
                    <div className={`create-comp-tab ${statusTypeTab == 0 ? "open" : "close"}`} onClick={() => setStatusTypeTab(0)}>{`Chờ duyệt (${onloadRegistrationData[0].length})`}</div>
                    <div className={`create-comp-tab ${statusTypeTab == 2 ? "open" : "close"}`} onClick={() => setStatusTypeTab(2)}>{`Danh sách chờ (${onloadRegistrationData[2].length})`}</div>
                    <div className={`create-comp-tab ${statusTypeTab == 3 ? "open" : "close"}`} onClick={() => setStatusTypeTab(3)}>{`Yêu cầu hủy (${onloadRegistrationData[3].length})`}</div>
                </div>

                <div className={`create-comp-box registration-table-container`}>
                    { onloadRegistrationData[statusTypeTab].length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <td>ID thí sinh</td>
                                    <td>Họ và tên</td>
                                    <td>Giới tính</td>
                                    <td>Ngày sinh</td>
                                    <td>Email</td>
                                    <td>Nội dung đăng ký</td>
                                    <td>Timestamp</td>
                                    <td>Trạng thái</td>
                                </tr>
                            </thead>
                            <tbody>
                                {onloadRegistrationData[statusTypeTab].map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.PERSONS.id}</td>
                                        <td>{item.PERSONS.name}</td>
                                        <td>{formatGender(item.PERSONS.gender)}</td>
                                        <td>{formatDob(item.PERSONS.dob)}</td>
                                        <td>{item.PERSONS.email}</td>
                                        <td>
                                            <div className="events">
                                            {item.REGISTRATION_EVENTS.map((event_item, event_index) => (
                                                <img
                                                    src={event_item.EVENTS.is_official
                                                        ? `/assets/event_icons/event/${event_item.event_id}.svg`
                                                        : `/assets/event_icons/unofficial/${event_item.event_id}.svg`
                                                    }
                                                    alt={event_item.EVENTS.name}
                                                    key={event_index}
                                                    title={event_item.EVENTS.name}
                                                />
                                            ))}
                                            </div>
                                        </td>
                                        <td>{formatTimestamp(item.last_update_at)}</td>
                                        <td className='actions'>
                                            <select value={item.status} onChange={(e) => handleOnChangeStatus(e.target.value, statusTypeTab, item.id)}>
                                                <option value='0' hidden={statusTypeTab == 3}>Chờ duyệt</option>
                                                <option value='1' hidden={statusTypeTab == 3}>Duyệt</option>
                                                <option value='2' hidden={statusTypeTab != 2}>Danh sách chờ</option>
                                                <option value='3' hidden={statusTypeTab == 0}>Yêu cầu hủy</option>
                                                <option value='4' hidden={statusTypeTab == 0}>Xác nhận hủy</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="no-result">
                            Không có đơn đăng ký.
                        </div>
                    )}
                </div>

                <div className="create-comp-footer">
                    <button className="btn-abort" onClick={() => handleShowDialog(false)}>Hủy</button>
                    <button className="btn-submit" onClick={() => handleUpdateRegistration()} disabled={isUpdating}>{!isUpdating ? "Cập nhật" : "Đang cập nhật..."}</button>
                </div>
            </div>
        </div>
    );
}