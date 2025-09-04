"use client";

export default function CompGeneralInfo({ data }) {

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

    function formatDateTime(from_date, till_date) {
        const from = new Date(from_date);
        const till = new Date(till_date);

        const formatTime = (d) => {
            const h = d.getHours(); // no padding
            const m = d.getMinutes();
            const s = d.getSeconds();

            let time = `${h}h`;
            if (m !== 0 || s !== 0) time += `${String(m).padStart(2, "0")}`;
            if (s !== 0) time += `:${String(s).padStart(2, "0")}`;
            return time;
        };

        const formatDatePart = (d) => {
            const day = String(d.getDate()).padStart(2, "0");
            const month = String(d.getMonth() + 1).padStart(2, "0");
            const year = d.getFullYear();
            return `${day}/${month}/${year}`;
        };

        const format = (d) => `${formatDatePart(d)} ${formatTime(d)}`;

        // same exact datetime
        if (from.getTime() === till.getTime()) return format(from);

        // same date but different time
        if (
            from.getFullYear() === till.getFullYear() &&
            from.getMonth() === till.getMonth() &&
            from.getDate() === till.getDate()
        ) {
            return `${formatDatePart(from)} ${formatTime(from)} - ${formatTime(till)}`;
        }

        // different day/month/year
        return `${format(from)} - ${format(till)}`;
    }

    return (
        <div className="comp-general-info-container">
            <div className="comp-general-info-header">Thời gian</div>
            <div>{formatDate(data.from_date, data.till_date)}</div>

            {data.competition_mode == 'off' &&
                <>
                <div className="comp-general-info-header">Venue</div>
                <div>{data.venue}</div>
                </>
            }
            <div className="comp-general-info-header">Địa điểm</div>
            <div>{data.competition_mode == 'off' ? data.venue_address : 'online'}</div>

            <div className="comp-general-info-header">Ban tổ chức</div>
            <div>{data.organiserInfo.name}<br /><a href={`mailto:${data.organiserInfo.email}`}>{data.organiserInfo.email}</a><br /><a href={`tel:${data.organiserInfo.phone}`}>{data.organiserInfo.phone}</a></div>
            
            <div className="comp-general-info-header">Thời gian đăng ký</div>
            <div>{formatDateTime(data.registration_from_date, data.registration_till_date)}</div>
            
            <div className="comp-general-info-header">Nội dung</div>
            <div className="comp-general-info-events-container">
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

            <div className="comp-general-info-header">Giới hạn thí sinh</div>
            <div>{data.competitors_limit}</div>
        </div>
    );
}