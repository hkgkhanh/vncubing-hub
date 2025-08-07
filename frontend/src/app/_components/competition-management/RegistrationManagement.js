"use client";

export default function RegistrationManagement() {

    return (
        <div>
            <h3>Đơn đăng ký</h3>

            <div className="search-box">
                <input type="text" placeholder="Nhập tên..."></input>
                <select>
                    <option>Tất cả</option>
                    <option>Chờ duyệt</option>
                    <option>Đã duyệt</option>
                </select>
            </div>
        </div>
    );
}