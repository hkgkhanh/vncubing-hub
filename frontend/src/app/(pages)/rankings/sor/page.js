import '@/app/_styles/rankings/default.css';
import SorTab from '@/app/_components/rankings/SorTab';
import RankingsTabNavigation from '@/app/_components/rankings/RankingsTabNavigation';

export const metadata = {
  title: {
    default: "Tổng thứ hạng",
  },
  description: "",
};

function SorRankings() {

    return (
        <div className="rankings-page">
			<RankingsTabNavigation activePage='sor' />
			<SorTab />
        </div>
    );
}

export default SorRankings;