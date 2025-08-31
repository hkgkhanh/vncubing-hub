'use client';

import { useEffect, useState } from 'react';
import { getWcaComps, splitWcaComps, getWcaChampsId } from '@/app/handlers/comps';
import CompetitionCard from '@/app/_components/competitions/CompetitionCard';
import '@/app/_styles/competitions/default.css';

function VncaCompTab() {
    // const [wcaComps, setWcaComps] = useState([]);
    const [inProgressWcaComps, setInProgressWcaComps] = useState([]);
    const [upcomingWcaComps, setUpcomingWcaComps] = useState([]);
    const [pastWcaComps, setPastWcaComps] = useState([]);
    // const [wcaChampsId, setWcaChampsId] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function handleGetWCAComps() {
            setIsLoading(true);
            const comps = await getWcaComps("VN");
            const wcaComps = await splitWcaComps(comps);

            // const gotWcaChamps = await getWcaChampsId("vn");

            setInProgressWcaComps(wcaComps.inProgress);
            setUpcomingWcaComps(wcaComps.upcoming);
            setPastWcaComps(wcaComps.past);
            // setWcaChampsId(gotWcaChamps);
            setIsLoading(false);
        }

        handleGetWCAComps();

    }, []);

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
                            <CompetitionCard isChamp={false} data={item} compTags={["vnca"]} progressStatus="inProgress" key={index} />
                        ))}
                    </div>
                </>
            )}

            {upcomingWcaComps.length > 0 && (
                <>
                    <div className='sub-heading'>Cuộc thi sắp diễn ra</div>

                    <div className='comps-list'>
                        {upcomingWcaComps.map((item, index) => (
                            <CompetitionCard isChamp={false} data={item} compTags={["vnca"]} progressStatus="upcoming" key={index} />
                        ))}
                    </div>
                </>
            )}

            {pastWcaComps.length > 0 && (
                <>
                    <div className='sub-heading'>Cuộc thi đã qua</div>

                    <div className='comps-list'>
                        {pastWcaComps.map((item, index) => (
                            <CompetitionCard isChamp={false} data={item} compTags={["vnca"]} progressStatus="past" key={index} />
                        ))}
                    </div>
                </>
            )}

        </div>
    );
}

export default VncaCompTab;