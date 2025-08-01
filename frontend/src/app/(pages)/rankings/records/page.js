import '@/app/_styles/rankings/default.css';
import RecordsTab from '@/app/_components/rankings/RecordsTab';
import RankingsTabNavigation from '@/app/_components/rankings/RankingsTabNavigation';

export const metadata = {
  title: {
    default: "BXH kỷ lục",
  },
  description: "",
};

function RecordsRankings() {

    return (
        <div className="rankings-page">
          <RankingsTabNavigation activePage='records' />
          <RecordsTab />
        </div>
    );
}

export default RecordsRankings;