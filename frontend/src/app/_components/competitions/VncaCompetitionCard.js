"use client";

import { nameToSlug } from "@/app/utils/codeGen";

export default function VncaCompetitionCard({ data, isChamp, compTags, progressStatus }) {

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
                <div className="comp-date">{formatDate(data.from_date, data.till_date)}</div>
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