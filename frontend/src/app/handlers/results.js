export async function getWcaRankings(event, type, person_or_result) {
    const res = await fetch('/api/results/wca-rankings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, event, person_or_result })
    });

    const data = await res.json();
    console.log(data);
    return data;
}

export async function getSorRankings(events, type) {
    const res = await fetch('/api/results/sor-rankings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events, type })
    });

    const data = await res.json();
    console.log(data);
    return data;
}