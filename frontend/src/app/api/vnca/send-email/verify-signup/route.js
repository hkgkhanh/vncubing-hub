import { NextResponse } from "next/server";
import { SignUpEmailCodeTemplate } from '@/app/_components/emailTemplates/SignUpMailCode';
import { Resend } from 'resend';

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export async function POST(req) {
    const body = await req.json();

    console.log(body.formData.email);

    const { data, error } = await resend.emails.send({
        from: 'VNCA Teams <stage.vnca@resend.dev>',
        to: [body.formData.email],
        subject: 'Mã xác nhận đăng ký tài khoản VNcubing',
        react: SignUpEmailCodeTemplate({ personName: body.formData.name, code: body.code }),
    });

    if (error) {
        console.error("Send email error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
}