import '@/app/_styles/rankings/default.css';
import KinchTab from '@/app/_components/rankings/KinchTab';
import RankingsTabNavigation from '@/app/_components/rankings/RankingsTabNavigation';

export const metadata = {
  title: {
    default: "Điểm kinch",
  },
  description: "",
};

function KinchRankings() {

    return (
        <div className="rankings-page">
			<RankingsTabNavigation activePage='kinch' />
			<KinchTab />
        </div>
    );
}

export default KinchRankings;