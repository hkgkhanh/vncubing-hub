import '@/app/_styles/rankings/default.css';
import MedalsTab from '@/app/_components/rankings/MedalsTab';
import RankingsTabNavigation from '@/app/_components/rankings/RankingsTabNavigation';

export const metadata = {
  title: {
    default: "BXH huy chương",
  },
  description: "",
};

function MedalsRankings() {

    return (
        <div className="rankings-page">
          <RankingsTabNavigation activePage='medals' />
          <MedalsTab />
        </div>
    );
}

export default MedalsRankings;