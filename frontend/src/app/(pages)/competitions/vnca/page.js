import '@/app/_styles/competitions/default.css';
import VncaCompTab from '@/app/_components/competitions/VncaCompTab';
import CompsTabNavigation from '@/app/_components/competitions/CompsTabNavigation';

export const metadata = {
  title: {
    default: "Cuộc thi",
  },
  description: "",
};

function VncaCompetition() {
    return (
        <div className="competition-page">
			<CompsTabNavigation activePage='vnca' />
			<VncaCompTab />
        </div>
    );
}

export default VncaCompetition;