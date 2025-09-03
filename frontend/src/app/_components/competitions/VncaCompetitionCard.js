"use client";

import { nameToSlug } from "@/app/utils/codeGen";

export default function VncaCompetitionCard({ data, isChamp, compTags, progressStatus }) {

    function formatDate(dateStr) {
        const [year, month, day] = dateStr.split("-");
        return `${day}/${month}/${year}`;
    }

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
                <a href={`/competitions/vnca/${nameToSlug(data.name, data.id)}`} className="comp-name">
                    {data.name}
                </a>
                <div className="comp-date">{formatDate(data.from_date)} - {formatDate(data.from_date)}</div>
                <div className="comp-city">{data.venue}</div>
                <div className="comp-events">
                    {data.events.map((item, index) => (
                    <img
                        src={item.is_official
                            ? `/assets/event_icons/event/${item.event_id}.svg`
                            : `/assets/event_icons/unofficial/${item.event_id}.svg`
                        }
                        alt={item.name}
                        key={index}
                        title={item.name}
                    />
                ))}
                </div>
            </div>
        </div>
    );
}