import '@/app/_styles/results/default.css';
import resultsData from "@/data/results.json";
import NationalChampions from '@/app/_components/results/NationalChampions';
import NationalRecords from '@/app/_components/results/NationalRecords';

export const metadata = {
  title: {
    default: "Kết quả",
  },
  description: "",
};

function Results() {
    const nationalRecords = resultsData["national_records"];
    const nationalChampions = resultsData["national_champions"];

    return (
        <div className="results-page">
            <section className="hero-section">
                <div className="hero-content">
                <h1>Người Việt Nam da nâu mắt đen</h1>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                </div>
            </section>

            <section className='other-section'>
                <h1>Kỷ lục Việt Nam</h1>

                <NationalRecords data={nationalRecords} />
            </section>

            <section className='other-section'>
                <h1>Nhà vô địch Việt Nam qua các năm</h1>
                <NationalChampions data={nationalChampions} />
            </section>
        </div>
    );
}

export default Results;