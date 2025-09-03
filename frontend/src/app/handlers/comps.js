import { supabase } from '@/app/utils/supabase';

export async function getWcaComps(page) {
    const res = await fetch('/api/competitions/get-wca-comps', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data = await res.json();
    // console.log(data);
    const comps = data.items;

    const pageSize = 24;
    const totalPages = Math.ceil(comps.length / pageSize);

    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    const paginatedComps = comps.slice(start, end);

    return {
        "pagination": {
            "page": page,
            "pageTotal": totalPages,
            "size": pageSize,
            "total": comps.length
        },
        "items": paginatedComps
    };
}

export async function getWcaChampsId() {
    const res = await fetch('/api/competitions/get-wca-champs', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
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

export async function getCompEventsByCompId(comp_id) {
    let { data, error } = await supabase.from('COMPETITION_ROUNDS').select(`event_id, EVENTS ( is_official, name )`).eq('competition_id', comp_id).eq('is_not_round', false);
    if (error) return {ok: false};

    data = data.map(row => ({
        ...row,
        is_official: row.EVENTS?.is_official ?? false,
        name: row.EVENTS?.name ?? null
    }));
    // console.log(data);

    const unique = Array.from(new Map(data.map(item => [item.event_id, item])).values());

    return {ok: true, data: unique};
}

export async function getVncaComps() {
    let { data, error } = await supabase.from('COMPETITIONS').select("*");
    // console.log(data);
    if (error) return {ok: false};

    const compsWithEvents = await Promise.all(
        data.map(async comp => {
            const events_data = await getCompEventsByCompId(comp.id);
            if (!events_data.ok) return {ok: false};
            return { ...comp, events: events_data.data };
        })
    );

    return {ok: true, data: compsWithEvents};
}

export async function splitVncaComps(comps) {
    let wcaComps = {
        inProgress: [],
        upcoming: [],
        past: []
    };
    
    for (let i = 0; i < comps.length; i++) {
        const fromDate = new Date(comps[i].from_date).setHours(0, 0, 0, 0); // setHours to get only the day, not the hours
        const tillDate = new Date(comps[i].from_date).setHours(0, 0, 0, 0);
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

export async function getCompById(comp_id) {
    let { data, error } = await supabase.from('COMPETITIONS').select("*").eq('id', comp_id);
    // console.log(data);
    if (error) return {ok: false};

    let { rounddata, rounderror } = await supabase.from('COMPETITION_ROUNDS').select("*").eq('id', comp_id);
    if (rounderror) return {ok: false};

    let { infotabdata, infotaberror } = await supabase.from('COMPETITION_INFO_TABS').select("*").eq('id', comp_id);
    if (infotaberror) return {ok: false};

    return {ok: true, data: data};
}