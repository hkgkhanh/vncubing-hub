"use client";

import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';

export default function CompScheduleTab({ data }) {

    function floorToHalfHour(date) {
        let d = new Date(date);
        d.setSeconds(0, 0); // clear seconds/ms

        let minutes = d.getMinutes();
        if (minutes < 30) {
            d.setMinutes(0);
        } else {
            d.setMinutes(30);
        }

        return d;
    }

    function ceilToHalfHour(date) {
        let d = new Date(date);
        d.setMinutes(d.getMinutes() + 15);
        d.setSeconds(0, 0); // clear seconds/ms

        let minutes = d.getMinutes();
        if (minutes === 0 || minutes === 30) {
            // already aligned
            return d;
        }

        if (minutes < 30) {
            d.setMinutes(30);
        } else {
            d.setMinutes(0);
            d.setHours(d.getHours() + 1);
        }

        return d;
    }

    let events = [];
    let days = new Set();
    let earliest = null, latest = null;

    for (let i = 0; i < data.rounds.length; i++) {
        let round = data.rounds[i];
        let name = (round.next_round == null && !round.is_not_round) ? round.name.split(" ").slice(0, -2).join(" ") + " Chung kết" : round.name;
        let from_datetime = round.from_datetime;
        let till_datetime = round.till_datetime;
        let bgColor = round.is_not_round ? "rgb(102,102,102)" : "rgb(48,74,150)";

        let from_time = new Date(from_datetime);
        let till_time = new Date(till_datetime);
        let earliest_time = earliest == null ? new Date(0) : new Date(earliest);
        let latest_time = latest == null ? new Date(0) : new Date(latest);

        if (earliest == null || earliest_time.getTime() > from_time.getTime()) earliest = from_datetime;
        if (latest == null || latest_time.getTime() < till_time.getTime()) latest = till_datetime;

        events.push({
            title: name,
            start: from_datetime,
            end: till_datetime,
            backgroundColor: bgColor,
            textColor: "rgb(255,255,255)"
        });

        let dayString = from_time.toISOString().split("T")[0];
        days.add(dayString);
    }

    let earliest_time = floorToHalfHour(new Date(earliest));
    let latest_time = ceilToHalfHour(new Date(latest));

    let earliest_hour = earliest_time.toTimeString();
    let latest_hour = latest_time.toTimeString();

    days = Array.from(days);

    return (
        <div className="comp-schedule-tab-container">
            <FullCalendar
                plugins={[ timeGridPlugin ]}
                initialView='customTimeGridDays'
                headerToolbar={{ left: '', center: '', right: '' }}
                dayHeaderFormat={{
                    month: 'long',
                    year: 'numeric',
                    day: 'numeric',
                    weekday: 'long'
                }}
                snapDuration={'00:05:00'}
                slotDuration={'00:15:00'}
                slotLabelInterval={'00:30:00'}
                allDaySlot={false}
                editable={false}
                droppable={false}
                timeZone={"local"}
                locale={'vn'}
                initialDate={data.from_date}
                views={{
                    customTimeGridDays: {
                        type: 'timeGrid',
                        duration: { days: days.length }
                    }
                }}
                slotMinTime={earliest_hour}
                slotMaxTime={latest_hour}
                events={events}
                height={"auto"}
            />
        </div>
    );
}