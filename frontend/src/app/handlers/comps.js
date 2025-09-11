import { supabase } from '@/app/utils/supabase';
import { calcResult, compareResults } from '../lib/stats';

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

export async function getCompRoundsByCompId(comp_id) {
    let { data, error } = await supabase.from('COMPETITION_ROUNDS').select("*").eq('competition_id', comp_id);
    if (error) return {ok: false};

    return {ok: true, data: data};
}

export async function getCompInfoTabsByCompId(comp_id) {
    let { data, error } = await supabase.from('COMPETITION_INFO_TABS').select("*").eq('competition_id', comp_id);
    if (error) return {ok: false};

    return {ok: true, data: data};
}

export async function getCompById(comp_id) {
    let { data, error } = await supabase.from('COMPETITIONS')
        .select(`
            *,
            ADMINS(name,phone,email),
            COMPETITION_ROUNDS(*, EVENTS(id, name, is_official), FORMATS(*)),
            COMPETITION_INFO_TABS(*)
        `)
        .eq('id', comp_id);

    // console.log(data);
    if (error) return {ok: false};

    let returnData = data[0];

    let eventsData = returnData.COMPETITION_ROUNDS.filter(row => row.is_not_round === false && row.event_id != null).map(row => ({
        event_id: row.event_id,
        is_official: row.EVENTS?.is_official ?? false,
        name: row.EVENTS?.name ?? null
    }));

    const unique = Array.from(new Map(eventsData.map(item => [item.event_id, item])).values());

    returnData.organiserInfo = returnData.ADMINS;
    returnData.rounds = returnData.COMPETITION_ROUNDS;
    returnData.infoTabs = returnData.COMPETITION_INFO_TABS;
    returnData.events = unique;

    return {ok: true, data: returnData};
}

export async function getProcessedRounds(rounds) {
    let events = [];

    let filteredRounds = rounds.filter(round => round.is_not_round === false).reduce((acc, r) => {
        const key = r.EVENTS?.id || "no_event";

        events.push(r.EVENTS);

        let name_parts = r.name.split(" ").slice(-2);
        let processed_name = '';

        if (r.next_round == null) processed_name = 'Chung kết';
        else processed_name = `Vòng ${name_parts[1]}`;

        const newRound = {
            ...r,
            name: processed_name
        };

        if (!acc[key]) acc[key] = [];
        acc[key].push(newRound);

        return acc;
    }, {});

    events = Array.from(new Map(events.map(e => [e.id, e])).values());

    events.sort((a, b) => {
        const eventCompare = a.id.localeCompare(b.id);
        if (eventCompare !== 0) return eventCompare;
        return 0;
    });

    for (const key in filteredRounds) {
        filteredRounds[key].sort((a, b) => a.id - b.id);
    }

    // console.log(filteredRounds);
    return {
        data: filteredRounds,
        comp_events: events
    };
}


export async function getCompResultsByRoundStringId(round_string_id) {
    let { data, error } = await supabase
        .from('RESULTS')
        .select(`
            *,
            COMPETITION_ROUNDS!inner(id,string_id,format_id),
            PERSONS!inner(id,name)
        `)
        .eq('COMPETITION_ROUNDS.string_id', round_string_id);

    if (error) return {ok: false};

    const transformed = data.map(item => ({
        ...item,
        avg: item.average,
        results: [item.value1, item.value2, item.value3, item.value4, item.value5]
    }));

    if (transformed.length < 1) return {ok: true, data: transformed};

    const format_id = transformed[0]?.COMPETITION_ROUNDS?.format_id;
    transformed.sort((a, b) => compareResults(a, b, format_id));

    let rank = 1;
    transformed[0].rank = rank;

    for (let i = 1; i < transformed.length; i++) {
        const prev = transformed[i - 1];
        const curr = transformed[i];

        if (compareResults(curr, prev, format_id) === 0) {
            curr.rank = prev.rank;
        } else {
            curr.rank = i + 1;
        }
    }

    return {ok: true, data: transformed};
}