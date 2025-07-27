"use client";

export default function CompetitionCard({ data, isChamp, compTags, progressStatus }) {
    // https://www.worldcubeassociation.org/competitions/ChampionnatCanadien2025

    function formatDate(dateStr) {
        const [year, month, day] = dateStr.split("-");
        return `${day}/${month}/${year}`;
    }

    function openCompOnWca(compId) {
        const url = `https://www.worldcubeassociation.org/competitions/${compId}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    }

    return (
        <div className="comp-card" onClick={() => openCompOnWca(data.id)}>
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
                <div className="comp-name">
                    {data.name}
                    
                </div>
                <div className="comp-date">{formatDate(data.date.from)} - {formatDate(data.date.till)}</div>
                <div className="comp-city">{data.city}</div>
                <div className="comp-events">
                    {data.events.map((item, index) => (
                    <img
                        src={`/assets/event_icons/event/${item}.svg`}
                        alt={item}
                        key={index}
                    />
                ))}
                </div>
            </div>
        </div>
    );
}