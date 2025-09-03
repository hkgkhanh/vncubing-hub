'use client';

import { useEffect, useState } from 'react';
import { getWcaComps, splitWcaComps, getWcaChampsId } from '@/app/handlers/comps';
import CompetitionCard from '@/app/_components/competitions/CompetitionCard';
import PageNavigation from '@/app/_components/PageNavigation';
import '@/app/_styles/competitions/default.css';

function WcaCompTab() {
    const [inProgressWcaComps, setInProgressWcaComps] = useState([]);
    const [upcomingWcaComps, setUpcomingWcaComps] = useState([]);
    const [pastWcaComps, setPastWcaComps] = useState([]);
    const [wcaChampsId, setWcaChampsId] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pageData, setPageData] = useState(null);

    useEffect(() => {
        async function handleGetWCAComps() {
            setIsLoading(true);
            const data = await getWcaComps(1);
            const wcaComps = await splitWcaComps(data.items);

            const gotWcaChamps = await getWcaChampsId();

            setInProgressWcaComps(wcaComps.inProgress);
            setUpcomingWcaComps(wcaComps.upcoming);
            setPastWcaComps(wcaComps.past);
            setWcaChampsId(gotWcaChamps);
            setPageData(data.pagination);
            setIsLoading(false);
        }

        handleGetWCAComps();

    }, []);

    const handlePageChange = async (newPage) => {
        setIsLoading(true);
        const data = await getWcaComps(newPage);
        const wcaComps = await splitWcaComps(data.items);

        const gotWcaChamps = await getWcaChampsId();

        setInProgressWcaComps(wcaComps.inProgress);
        setUpcomingWcaComps(wcaComps.upcoming);
        setPastWcaComps(wcaComps.past);
        setWcaChampsId(gotWcaChamps);
        setPageData(data.pagination);
        setIsLoading(false);
    };

    if (isLoading) return (
        <div className='spinner-container'>
            <img
                src="/ui/spinner.svg"
                alt="Loading"
                className="spinner"
                title="Loading"
            />
        </div>
    );

    return (
        <div className="competition-page">

            {inProgressWcaComps.length > 0 && (
                <>
                    <div className='sub-heading'>Cuộc thi đang diễn ra</div>

                    <div className='comps-list'>
                        {inProgressWcaComps.map((item, index) => (
                            <CompetitionCard isChamp={wcaChampsId.includes(item.id)} data={item} compTags={["wca", "vnca"]} progressStatus="inProgress" key={index} />
                        ))}
                    </div>
                </>
            )}

            {upcomingWcaComps.length > 0 && (
                <>
                    <div className='sub-heading'>Cuộc thi sắp diễn ra</div>

                    <div className='comps-list'>
                        {upcomingWcaComps.map((item, index) => (
                            <CompetitionCard isChamp={wcaChampsId.includes(item.id)} data={item} compTags={["wca", "vnca"]} progressStatus="upcoming" key={index} />
                        ))}
                    </div>
                </>
            )}

            {pastWcaComps.length > 0 && (
                <>
                    <div className='sub-heading'>Cuộc thi đã qua</div>

                    <div className='comps-list'>
                        {pastWcaComps.map((item, index) => (
                            <CompetitionCard isChamp={wcaChampsId.includes(item.id)} data={item} compTags={["wca", "vnca"]} progressStatus="past" key={index} />
                        ))}
                    </div>
                </>
            )}

            { (!isLoading && !(pageData.total == 0)) &&
                <PageNavigation pageData={pageData} onPageChange={handlePageChange} />
            }

        </div>
    );
}

export default WcaCompTab;