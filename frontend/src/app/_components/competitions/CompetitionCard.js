"use client";

import ResultsFilters from '../../../data/results-filter.json';

export default function CompetitionCard({ data, isChamp, compTags, progressStatus }) {
    const events = ResultsFilters['wca_filter']['event'];
    const eventMap = events.reduce((acc, e) => {
        acc[e.id] = e;
        return acc;
    }, {});

    function formatDate(from_date, till_date) {
        const [fromYear, fromMonth, fromDay] = from_date.split("-");
        const [tillYear, tillMonth, tillDay] = till_date.split("-");

        // same exact day
        if (fromYear === tillYear && fromMonth === tillMonth && fromDay === tillDay)
            return `${fromDay}/${fromMonth}/${fromYear}`;

        // same month & year
        if (fromYear === tillYear && fromMonth === tillMonth)
            return `${fromDay}-${tillDay}/${fromMonth}/${fromYear}`;

        // different month/year
        return `${fromDay}/${fromMonth}/${fromYear} - ${tillDay}/${tillMonth}/${tillYear}`;
    }

    // function openCompOnWca(compId) {
    //     // https://www.worldcubeassociation.org/competitions/ChampionnatCanadien2025
    //     const url = `https://www.worldcubeassociation.org/competitions/${compId}`;
    //     window.open(url, '_blank');
    // }

    return (
        <div className="comp-card">
            <div className="comp-tag">
                {isChamp && (
                    <img
                    src="/ui/trophy.svg"
                    alt="Championship"
                    className="champ-tag"
                    title="Championship"
                    />
                )}
                {compTags.map((item, index) => (
                    <img
                        src={`/assets/${item}_tag.svg`}
                        alt={item}
                        key={index}
                        title={item}
                    />
                ))}
            </div>
            <div className="comp-info">
                <a href={`https://www.worldcubeassociation.org/competitions/${data.id}`} target="_blank" className="comp-name">
                    {data.name}
                </a>
                <div className="comp-date">{formatDate(data.date.from, data.date.till)}</div>
                <div className="comp-city">{data.city}</div>
                <div className="comp-events">
                    {data.events.map((item, index) => (
                    <img
                        src={`/assets/event_icons/event/${item}.svg`}
                        alt={item}
                        key={index}
                        title={eventMap[item].name_vi}
                    />
                ))}
                </div>
            </div>
        </div>
    );
}