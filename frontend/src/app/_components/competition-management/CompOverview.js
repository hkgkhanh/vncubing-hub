"use client";

import { useState } from 'react';

export default function CompOverview() {
    const [showNewCompDialog, setShowNewCompDialog] = useState(false);

    const handleShowNewCompDialog = () => {
        const dialog = document.getElementById('create-comp-container');
        if (dialog) dialog.showModal();
    }

    const handleCloseNewCompDialog = () => {
        const dialog = document.getElementById('create-comp-container');
        if (dialog) dialog.close();
    }

    return (
        <div className="competition-manage-box">
            <h3>Cuộc thi</h3>

            <div className="search-box">
                <input type="text" placeholder="Nhập tên cuộc thi..." />
                <button onClick={() => setShowNewCompDialog(true)}>Tạo cuộc thi</button>
            </div>

            <div className="table-container">
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
                        <tr>
                            <td>1</td>
                            <td>Testing Open 2025</td>
                            <td>10/8/2025</td>
                            <td>17/8/2025 - 18/8/2025</td>
                            <td><a href="#">Chi tiết</a></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {showNewCompDialog && (
                <div className="create-comp-backdrop">
                    <div className="create-comp-container" id="create-comp-container">
                        <div className="create-comp-box">
                            
                        </div>

                        <div className="create-comp-footer">
                            <button className="btn-abort" onClick={() => setShowNewCompDialog(false)}>Hủy</button>
                            <button className="btn-submit">Tạo cuộc thi</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}