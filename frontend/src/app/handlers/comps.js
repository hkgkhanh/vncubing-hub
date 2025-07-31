export async function getWcaComps() {
    const res = await fetch('/api/competitions/get-wca-comps', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        // body: JSON.stringify({ countryId })
    });

    const data = await res.json();
    // console.log(data);
    const comps = data.items.slice(0, 25); // only get the latest 25 comps (which is still a lot in Vietnam)
    return comps;
}

export async function getWcaChampsId() {
    const res = await fetch('/api/competitions/get-wca-champs', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        // body: JSON.stringify({ 'page': 1 })
    });

    const data = await res.json();
    const comps = data.items;

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