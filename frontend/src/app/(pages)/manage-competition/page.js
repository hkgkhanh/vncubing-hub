import '@/app/_styles/manage-competition/default.css';
import CompRegistrationOverview from '@/app/_components/competition-management/CompRegistrationOverview';
import CompOverview from '@/app/_components/competition-management/CompOverview';
import { cookies } from "next/headers";

export const metadata = {
  title: {
    default: "Quản lý cuộc thi",
  },
  description: "",
};

async function CompetitionManagement() {
    const cookieStore = await cookies();
    const organiserAccessToken = cookieStore.get("organiser_session")?.value;
    const isLoggedInOrganiser = !!organiserAccessToken;

    if (!isLoggedInOrganiser) {
        return (
            <div className="access-denied">
                <h3>Bạn không có quyền truy cập trang này.</h3>
            </div>
        );
    }

    return (
        <div className="manage-competition-page">
            {/* <CompRegistrationOverview /> */}
            <CompOverview />
            <CompRegistrationOverview />
        </div>
    );
}

export default CompetitionManagement;