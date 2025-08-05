import * as React from 'react';

export function ForgetPasswordEmailCodeTemplate({ code }) {
  return (
    <div>
      <p>Chào bạn!</p>
      <p>Đây là mã xác minh yêu cầu cài đặt lại mật khẩu cho tài khoản VNcubing của bạn:</p>
      <p><b>{code}</b></p>
      <p>Mã xác nhận có hiệu lực trong 2 phút. Sau khoảng thời gian này, bạn cần yêu cầu gửi lại mã xác minh mới.</p>
      <p>Trân trọng,<br></br>Đội ngũ VNCA.</p>
      <p></p>
    </div>
  );
}