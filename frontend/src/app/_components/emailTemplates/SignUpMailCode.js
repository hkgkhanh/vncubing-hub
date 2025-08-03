import * as React from 'react';

export function SignUpEmailCodeTemplate({ personName, code }) {
  return (
    <div>
      <p>Xin chào {personName}!</p>
      <p>Xin cảm ơn bạn đã đăng ký tài khoản tại VNcubing. Đây là mã xác nhận email của bạn:</p>
      <p><b>{code}</b></p>
      <p>Mã xác nhận có hiệu lực trong 2 phút. Sau khoảng thời gian này, bạn cần yêu cầu gửi lại mã xác nhận mới.</p>
      <p>Trân trọng,<br></br>Đội ngũ VNCA.</p>
      <p></p>
    </div>
  );
}