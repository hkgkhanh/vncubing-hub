import { NextResponse } from "next/server";
import { ForgetPasswordEmailCodeTemplate } from '@/app/_components/emailTemplates/ForgetPasswordEmailCode';
import { Resend } from 'resend';

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export async function POST(req) {
    const body = await req.json();

    const { data, error } = await resend.emails.send({
        from: 'VNCA Teams <stage.vnca@resend.dev>',
        to: [body.email],
        subject: 'Mã xác minh yêu cầu cài đặt lại mật khẩu VNcubing',
        react: ForgetPasswordEmailCodeTemplate({ code: body.code }),
    });

    if (error) {
        console.error("Send email error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
}