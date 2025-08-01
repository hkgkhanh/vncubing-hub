import '@/app/_styles/rankings/default.css';
import WcaRankingTab from '@/app/_components/rankings/WcaRankingsTab';
import RankingsTabNavigation from '@/app/_components/rankings/RankingsTabNavigation';

export const metadata = {
  title: {
    default: "Xếp hạng",
  },
  description: "",
};

function Rankings() {

    return (
        <div className="rankings-page">
			<RankingsTabNavigation activePage='wca' />
			<WcaRankingTab />
        </div>
    );
}

export default Rankings;