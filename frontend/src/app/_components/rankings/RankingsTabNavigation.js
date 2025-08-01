'use client';

import '@/app/_styles/rankings/default.css';
import Link from 'next/link';

// export const metadata = {
//   title: {
//     default: "Kết quả",
//   },
//   description: "",
// };

function RankingsTabNavigation({ activePage }) {

    return (
        <div className="rankings-officity">
            <Link href='/rankings'>
                <div className={`rankings-tab ${activePage == 'wca' ? 'active' : ''}`}>Kết quả WCA</div>
            </Link>
            <Link href='/rankings/sor'>
                <div className={`rankings-tab ${activePage == 'sor' ? 'active' : ''}`}>Tổng thứ hạng</div>
            </Link>
            <Link href='/rankings/kinch'>
                <div className={`rankings-tab ${activePage == 'kinch' ? 'active' : ''}`}>Điểm kinch</div>
            </Link>
            <Link href='/rankings/medals'>
                <div className={`rankings-tab ${activePage == 'medals' ? 'active' : ''}`}>BXH huy chương</div>
            </Link>
        </div>
    );
}

export default RankingsTabNavigation;