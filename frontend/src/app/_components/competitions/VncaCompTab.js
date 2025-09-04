'use client';

import { useEffect, useState } from 'react';
import { getVncaComps, splitVncaComps } from '@/app/handlers/comps';
import '@/app/_styles/competitions/default.css';
import VncaCompetitionCard from './VncaCompetitionCard';

function VncaCompTab() {
    const [inProgressVncaComps, setInProgressVncaComps] = useState([]);
    const [upcomingVncaComps, setUpcomingVncaComps] = useState([]);
    const [pastVncaComps, setPastVncaComps] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function handleGetVncaComps() {
            setIsLoading(true);
            const compsData = await getVncaComps();
            // console.log(compsData);
            if (!compsData.ok) alert("Lỗi tải trang, vui lòng thử lại.");
            const splitComps = await splitVncaComps(compsData.data);
            // console.log(splitComps);
            setInProgressVncaComps(splitComps.inProgress);
            setUpcomingVncaComps(splitComps.upcoming);
            setPastVncaComps(splitComps.past);
            setIsLoading(false);
        }

        handleGetVncaComps();

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

            {inProgressVncaComps.length > 0 && (
                <>
                    <div className='sub-heading'>Cuộc thi đang diễn ra</div>

                    <div className='comps-list'>
                        {inProgressVncaComps.map((item, index) => (
                            <VncaCompetitionCard isChamp={false} data={item} compTags={["vnca"]} progressStatus="inProgress" key={index} />
                        ))}
                    </div>
                </>
            )}

            {upcomingVncaComps.length > 0 && (
                <>
                    <div className='sub-heading'>Cuộc thi sắp diễn ra</div>

                    <div className='comps-list'>
                        {upcomingVncaComps.map((item, index) => (
                            <VncaCompetitionCard isChamp={false} data={item} compTags={["vnca"]} progressStatus="upcoming" key={index} />
                        ))}
                    </div>
                </>
            )}

            {pastVncaComps.length > 0 && (
                <>
                    <div className='sub-heading'>Cuộc thi đã qua</div>

                    <div className='comps-list'>
                        {pastVncaComps.map((item, index) => (
                            <VncaCompetitionCard isChamp={false} data={item} compTags={["vnca"]} progressStatus="past" key={index} />
                        ))}
                    </div>
                </>
            )}

        </div>
    );
}

export default VncaCompTab;