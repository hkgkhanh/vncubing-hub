export async function getWcaRankings(event, type, person_or_result) {
    const res = await fetch('/api/results/wca-rankings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, event, person_or_result })
    });

    const data = await res.json();
    // console.log(data);
    return data;
}

export async function getSorRankings(category, type, page) {
    const res = await fetch('/api/results/sor-rankings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category, type, page })
    });
    const data = await res.json();
    // console.log(data);

    const epRes = await fetch('/api/results/events-participants', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    const epData = await epRes.json();

    return { "participation": epData, "data": data };
}

export async function getKinchRankings(page) {
    const res = await fetch('/api/results/kinch-rankings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ page })
    });
    const data = await res.json();
    return data;
}