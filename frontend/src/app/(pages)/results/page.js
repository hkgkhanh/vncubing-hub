'use client';

import { useState } from 'react';
// import logo from './logo_vnca.svg';
import '@/app/_styles/results/default.css';
import WcaRankingTab from '@/app/_components/results/WcaRankingsTab';
import SorTab from '@/app/_components/results/SorTab';
import KinchTab from '@/app/_components/results/KinchTab';

// export const metadata = {
//   title: {
//     default: "Kết quả",
//   },
//   description: "",
// };

function Rankings() {
	const [openingTab, setOpeningTab] = useState('wca');

	function handleChangeTab(tab) {
		setOpeningTab(tab);
	}

    return (
        <div className="results-page">
			<div className="results-officity">
				<div className={`results-tab ${openingTab === 'wca' ? 'active' : ''}`} onClick={() => handleChangeTab('wca')}>Kết quả WCA</div>
				<div className={`results-tab ${openingTab === 'sor' ? 'active' : ''}`} onClick={() => handleChangeTab('sor')}>Tổng thứ hạng</div>
				<div className={`results-tab ${openingTab === 'kinch' ? 'active' : ''}`} onClick={() => handleChangeTab('kinch')}>Điểm kinch</div>
			</div>
            {openingTab == 'wca' && (
				<>
					<WcaRankingTab />
				</>
			)}
			{openingTab == 'sor' && (
				<>
					<SorTab />
				</>
			)}

			{openingTab == 'kinch' && (
				<>
					<KinchTab />
				</>
			)}
        </div>
    );
}

export default Rankings;