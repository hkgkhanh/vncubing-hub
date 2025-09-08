"use client";

import { useState, useEffect } from 'react';
import PageNavigation from '../PageNavigation';
import CompRegistrationApprovalForm from './CompRegistrationApprovalForm';
import { getCompRegistrationDataByOrganiserId } from '@/app/handlers/competition-management';

export default function CompRegistrationOverview() {
    const [registrationsData, setRegistrationsData] = useState([]);
    const [pageData, setPageData] = useState(null);
    const [isLoadingRegistrations, setIsLoadingRegistrations] = useState(true);
    const [isLoadingRegistrationDialog, setIsLoadingRegistrationDialog] = useState(false);
    const [showRegistrationDialog, setShowRegistrationDialog] = useState(false);
    const [selectedRegistrationData, setSelectedRegistrationData] = useState(null);

    useEffect(() => {
        async function fetchComps() {
            setIsLoadingRegistrations(true);
            const { ok, data } = await getCompRegistrationDataByOrganiserId();

            if (!ok) alert("Tải trang thất bại, vui lòng thử lại.");
            console.log(data);

            setRegistrationsData(data);
            setIsLoadingRegistrations(false);
        }
        fetchComps();
    }, []);

    const handleShowRegistrationDialog = async (comp_id) => {
        setIsLoadingRegistrationDialog(true);
        setSelectedRegistrationData(registrationsData.find(item => item.comp_id === comp_id));
        setShowRegistrationDialog(true);
        // setIsLoadingRegistrationDialog(false);
    }

    return (
        <>
        <div className="competition-manage-box">
            <h3>Đơn đăng ký</h3>

            {isLoadingRegistrations ? (
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
                <input type="text" placeholder="Nhập tên cuộc thi..."></input>
            </div>

            <div className="table-container">
                { registrationsData.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <td>ID</td>
                                <td>Cuộc thi</td>
                                <td>Đã duyệt</td>
                                <td>Chờ duyệt</td>
                                <td>Yêu cầu hủy</td>
                                <td>Hành động</td>
                            </tr>
                        </thead>
                        <tbody>
                            {registrationsData.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.comp_id}</td>
                                    <td>{item.comp_name}</td>
                                    <td>{item.approved}</td>
                                    <td>{item.pending}</td>
                                    <td>{item.request_cancel}</td>
                                    <td>
                                        <svg role="img" aria-label="[title]" onClick={() => handleShowRegistrationDialog(item.comp_id)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M535.6 85.7C513.7 63.8 478.3 63.8 456.4 85.7L432 110.1L529.9 208L554.3 183.6C576.2 161.7 576.2 126.3 554.3 104.4L535.6 85.7zM236.4 305.7C230.3 311.8 225.6 319.3 222.9 327.6L193.3 416.4C190.4 425 192.7 434.5 199.1 441C205.5 447.5 215 449.7 223.7 446.8L312.5 417.2C320.7 414.5 328.2 409.8 334.4 403.7L496 241.9L398.1 144L236.4 305.7zM160 128C107 128 64 171 64 224L64 480C64 533 107 576 160 576L416 576C469 576 512 533 512 480L512 384C512 366.3 497.7 352 480 352C462.3 352 448 366.3 448 384L448 480C448 497.7 433.7 512 416 512L160 512C142.3 512 128 497.7 128 480L128 224C128 206.3 142.3 192 160 192L256 192C273.7 192 288 177.7 288 160C288 142.3 273.7 128 256 128L160 128z"/><title>Chi tiết</title></svg>
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
            </div></>)}
        </div>
        
        {isLoadingRegistrationDialog && (
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

        {showRegistrationDialog && (
            <CompRegistrationApprovalForm handleSetIsLoadingRegistrationDetails={setIsLoadingRegistrationDialog} handleShowDialog={setShowRegistrationDialog} data={selectedRegistrationData} />
        )}
        </>
    );
}