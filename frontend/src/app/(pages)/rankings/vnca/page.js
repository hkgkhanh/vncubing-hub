import '@/app/_styles/rankings/default.css';
import VncaRankingTab from '@/app/_components/rankings/VncaRankingsTab';
import RankingsTabNavigation from '@/app/_components/rankings/RankingsTabNavigation';

export const metadata = {
  title: {
    default: "Xếp hạng",
  },
  description: "",
};

function VncaRankings() {

    return (
        <div className="rankings-page">
          <RankingsTabNavigation activePage='vnca' />
          <VncaRankingTab />
        </div>
    );
}

export default VncaRankings;