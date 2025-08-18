"use client";

export default function CompRegistrationOverview() {

    return (
        <div className="competition-manage-box">
            <h3>Đơn đăng ký</h3>

            <div className="search-box">
                <input type="text" placeholder="Nhập tên cuộc thi..."></input>
                {/* <select>
                    <option>Tất cả</option>
                    <option>Chờ duyệt</option>
                    <option>Đã duyệt</option>
                </select> */}
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <td>ID</td>
                            <td>Cuộc thi</td>
                            <td>Đã duyệt</td>
                            <td>Chờ duyệt</td>
                            <td>Hành động</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Testing Open 2025</td>
                            <td>15</td>
                            <td>9</td>
                            <td><a href="#">Chi tiết</a></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}