export async function getWcaComps(countryId) {
    const res = await fetch('/api/competitions/get-wca-comps', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ countryId })
    });

    const data = await res.json();
    // console.log(data);
    const comps = data.items.slice(0, 25); // only get the latest 25 comps (which is still a lot in Vietnam)
    return comps;
}

export async function getWcaChampsId(countryId) {
    const res = await fetch('/api/competitions/get-wca-champs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 'page': 1 })
    });

    const data = await res.json();
    let comps = data.items.filter(item => item.region === countryId);
    let pageCount = Math.floor(data.total / 1000);

    for (let i = 2; i < pageCount + 2; i++) {
        const continue_res = await fetch('/api/competitions/get-wca-champs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 'page': i })
        });

        const continue_data = await continue_res.json();
        let continue_comps = continue_data.items.filter(item => item.region === countryId);
        comps.push(...continue_comps);
    }

    // console.log(comps);
    let compsId = [];
    for (let i = 0; i < comps.length; i++) {
        compsId.push(comps[i].id);
    }

    return compsId;
}

export async function splitWcaComps(comps) {
    let wcaComps = {
        inProgress: [],
        upcoming: [],
        past: []
    };
    
    for (let i = 0; i < comps.length; i++) {
        const fromDate = new Date(comps[i].date.from).setHours(0, 0, 0, 0); // setHours to get only the day, not the hours
        const tillDate = new Date(comps[i].date.till).setHours(0, 0, 0, 0);
        const currDate = new Date().setHours(0, 0, 0, 0);

        if (currDate < fromDate) {
            wcaComps.upcoming.push(comps[i]);
        } else if (currDate > tillDate) {
            wcaComps.past.push(comps[i]);
        } else {
            wcaComps.inProgress.push(comps[i]);
        }
    }

    return wcaComps;
}