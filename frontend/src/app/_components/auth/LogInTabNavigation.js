'use client';

import '@/app/_styles/rankings/default.css';
import Link from 'next/link';

function LogInTabNavigation({ activePage }) {

    return (
        <div className="rankings-officity">
            <Link href='/login'>
                <div className={`rankings-tab ${activePage == 'person' ? 'active' : ''}`}>Người chơi</div>
            </Link>
            <Link href='/login/organiser'>
                <div className={`rankings-tab ${activePage == 'organiser' ? 'active' : ''}`}>Nhà tổ chức cuộc thi</div>
            </Link>
        </div>
    );
}

export default LogInTabNavigation;