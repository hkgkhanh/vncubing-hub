'use client';

import { useState, useEffect } from 'react';
// import logo from './logo_vnca.svg';
import '@/app/_styles/results/default.css';
import { getWcaRankings } from "@/app/handlers/results";
import RankingTable from '@/app/_components/results/RankingTable';
import resultFilters from '@/data/results-filter.json';

// export const metadata = {
//   title: {
//     default: "Kết quả",
//   },
//   description: "",
// };

function Rankings() {
	const [rankingData, setRankingData] = useState([]);
	const [resultIsLoading, setResultIsLoading] = useState(true);
	const [openingTab, setOpeningTab] = useState('wca');
	const [filters, setFilters] = useState({
		event: '333',
		type: 'single',
		person_or_result: 'person'
	});

	const wcaFilters = resultFilters.wca_filter;
	const wcaEventsFilters = wcaFilters.event;
	const wcaTypeFilters = wcaFilters.type;
	const wcaShowFilters = wcaFilters.show;

	useEffect(() => {
			async function handleGetWcaRankings() {
				const data = await getWcaRankings(filters.event, filters.type, filters.person_or_result);
	
				setResultIsLoading(false);
				setRankingData(data);
			}
	
			handleGetWcaRankings();
	
		}, []);

	function handleChangeTab(tab) {
		setOpeningTab(tab);
	}

	const handleChangeFilter = (e) => {
		setFilters({ ...filters, [e.target.name]: e.target.value });
	};

	const handleSubmitFilter = (e) => {
		e.preventDefault();
		// setFilters({ ...filters, [e.target.name]: e.target.value });

		async function handleGetWcaRankings() {
			setResultIsLoading(true);
			const data = await getWcaRankings(filters.event, filters.type, filters.person_or_result);

			setResultIsLoading(false);
			setRankingData(data);
		}

		handleGetWcaRankings();
	};

    return (
        <div className="results-page">
			<div className="results-officity">
				<div className={`results-tab ${openingTab === 'wca' ? 'active' : ''}`} onClick={() => handleChangeTab('wca')}>Kết quả WCA</div>
				<div className={`results-tab ${openingTab === 'else' ? 'active' : ''}`} onClick={() => handleChangeTab('else')}>Kết quả khác</div>
			</div>
            {openingTab == 'wca' && (
				<div className='wca-filters'>
					<form onSubmit={handleSubmitFilter}>
						<label>
							Nội dung
							<select name="event" value={filters.event} onChange={handleChangeFilter}>
								{wcaEventsFilters.map((item, index) => (
									<option value={item.id} key={index}>{item.name_vi}</option>
								))}
							</select>
						</label>

						<label>
							Thành tích
							<select name="type" value={filters.type} onChange={handleChangeFilter}>
								{(filters.event === "333mbf"
									? wcaTypeFilters.filter(item => item.id === "single")
									: wcaTypeFilters
								).map((item, index) => (
									<option value={item.id} key={index}>{item.name_vi}</option>
								))}
							</select>
						</label>

						<label>
							Hiển thị
							<select name="person_or_result" value={filters.person_or_result} onChange={handleChangeFilter}>
								{wcaShowFilters.map((item, index) => (
									<option value={item.id} key={index}>{item.name_vi}</option>
								))}
							</select>
						</label>
						

						<button type="submit">Xác nhận</button>
					</form>
				</div>
			)}

			<RankingTable data={rankingData} event={filters.event} type={filters.type} loadingStatus={resultIsLoading} />
        </div>
    );
}

export default Rankings;