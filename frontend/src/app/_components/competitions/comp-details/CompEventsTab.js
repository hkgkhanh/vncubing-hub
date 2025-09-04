"use client";

export default function CompEventsTab({ data }) {

    let eventsObject = {};

    data.rounds.sort((a, b) => a.id - b.id); // to make sure the ascending order of the rounds

    for (let i = 0; i < data.rounds.length; i++) {
        if (data.rounds[i].is_not_round) continue;

        let event_id = data.rounds[i].event_id;
        let event_name = data.events.find(r => r.event_id === event_id).name;
        let round_name = data.rounds[i].next_round == null ? "Chung kết" : data.rounds[i].name.split(" ").slice(-2).join(" ");
        let format = data.rounds[i].FORMATS.name;
        let time_limit = data.rounds[i].time_limit == null ? "" : data.rounds[i].time_limit;
        let cutoff = data.rounds[i].cutoff == null ? "" : data.rounds[i].cutoff;
        let to_advanced = data.rounds[i].to_advance == null ? "" : `Top ${data.rounds[i].to_advance}`;

        if (!eventsObject[event_id]) {
            eventsObject[event_id] = [{
                event_name,
                round_name,
                format,
                time_limit,
                cutoff,
                to_advanced
            }]
        } else {
            eventsObject[event_id].push({
                event_name,
                round_name,
                format,
                time_limit,
                cutoff,
                to_advanced
            })
        }
    }

    return (
        <div className="comp-events-tab-container">
            <table>
                <thead>
                    <tr>
                        <td>Nội dung</td>
                        <td>Vòng</td>
                        <td>Thể thức</td>
                        <td>Giới hạn thời gian</td>
                        <td>Cutoff</td>
                        <td>Vào vòng sau</td>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(eventsObject).map(([eventId, rounds]) =>
                        rounds.map((round, idx) => (
                            <tr key={`${eventId}-${idx}`}>
                                {idx == 0 && <td rowSpan={rounds.length}>{round.event_name}</td>}
                                <td>{round.round_name}</td>
                                <td>{round.format}</td>
                                <td>{round.time_limit || ""}</td>
                                <td>{round.cutoff || ""}</td>
                                <td>{round.to_advanced || ""}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}