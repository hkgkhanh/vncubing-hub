'use client';

import '@/app/_styles/rankings/default.css';
import Link from 'next/link';

function CompsTabNavigation({ activePage }) {

    return (
        <div className="rankings-officity">
            <Link href='/competitions/vnca'>
                <div className={`rankings-tab ${activePage == 'vnca' ? 'active' : ''}`}>VNCA</div>
            </Link>
            <Link href='/competitions'>
                <div className={`rankings-tab ${activePage == 'wca' ? 'active' : ''}`}>WCA</div>
            </Link>
        </div>
    );
}

export default CompsTabNavigation;