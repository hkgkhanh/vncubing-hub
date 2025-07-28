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