import { supabase } from '@/app/utils/supabase';

export async function createComp(compData) {
    const {compName, compVenueName, compVenueAddress, compMode, compRegFromDate, compRegTillDate, compFromDate, compTillDate, compCompetitorLimit, compEventRounds, compInfoTabs} = compData;
    
    const session = await fetch(`/api/session?user=${encodeURIComponent('organiser_session')}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const sessionData = await session.json();
    const organiserId = sessionData.userId;

    let { data, error } = await supabase.from('COMPETITIONS')
        .insert([
            {
                name: compName, venue: compVenueName, venue_address: compVenueAddress, competition_mode: compMode,
                organiser: organiserId, registration_from_date: compRegFromDate, registration_till_date: compRegTillDate,
                from_date: compFromDate, till_date: compTillDate, competitors_limit: compCompetitorLimit
             },
        ])
        .select();
    // console.log(data);
    if (error) return {ok: false};

    const compId = data[0].id;

    // add prefix {compId} to the event rounds' string_id
    // console.log(compEventRounds);
    // console.log(compInfoTabs);

    const eventIds = Object.getOwnPropertyNames(compEventRounds);

    for (let i = 0; i < eventIds.length; i++) {
        const eventId = eventIds[i];

        for (let j = 0; j < compEventRounds[eventId].length; j++) {
            compEventRounds[eventId][j].str_id = `${compId}-${eventId}-${j+1}`;

            if (j < compEventRounds[eventId].length - 1) {
                compEventRounds[eventId][j].next_round = `${compId}-${eventId}-${j+2}`;
            }
        }
    }

    // console.log(compEventRounds);
    // console.log(compInfoTabs);

    let eventRoundsToInsert = [];
    let infoTabsToInsert = [];

    for (let i = 0; i < eventIds.length; i++) {
        const eventId = eventIds[i];
        for (let j = 0; j < compEventRounds[eventId].length; j++) {
            let recordToInsert = compEventRounds[eventId][j];

            eventRoundsToInsert.push({
                competition_id: compId,
                event_id: recordToInsert.event_id,
                format_id: recordToInsert.format_id,
                name: recordToInsert.name,
                to_advance: recordToInsert.to_advance,
                is_not_round: recordToInsert.is_not_round,
                time_limit: recordToInsert.time_limit,
                from_datetime: recordToInsert.from_datetime,
                till_datetime: recordToInsert.till_datetime,
                cutoff: recordToInsert.cutoff,
                string_id: recordToInsert.str_id,
                next_round: recordToInsert.next_round
            });
        }
    }

    for (let i = 0; i < compInfoTabs.length; i++) {
        let recordToInsert = compInfoTabs[i];

        infoTabsToInsert.push({
            competition_id: compId,
            name: recordToInsert.name,
            info_text: recordToInsert.info_text
        });
    }

    // insert rounds and tabs
    let { rounddata, rounderror } = await supabase.from('COMPETITION_ROUNDS')
        .insert(eventRoundsToInsert)
        .select();

    if (rounderror) {
        await supabase.from('COMPETITIONS').delete().eq('id', compId); // revert if fails
        return {ok: false};
    }

    let { tabdata, taberror } = await supabase.from('COMPETITION_INFO_TABS')
        .insert(infoTabsToInsert)
        .select();

    if (taberror) {
        await supabase.from('COMPETITIONS').delete().eq('id', compId); // revert if fails
        await supabase.from('COMPETITIONS_ROUNDS').delete().eq('competition_id', compId);
        return {ok: false};
    }

    return {ok: true};
}



export async function getManageableComps(page) {
    const session = await fetch(`/api/session?user=${encodeURIComponent('organiser_session')}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const sessionData = await session.json();
    const organiserId = sessionData.userId;

    const { count, countError } = await supabase.from('COMPETITIONS').select('*', { count: 'exact', head: true }).eq('organiser', organiserId);
    if (countError) return {ok: false};

    let { data, error } = await supabase.from('COMPETITIONS').select('*').eq('organiser', organiserId).order('from_date', {'ascending': false}).range((page - 1) * 10, (page - 1) * 10 + 4);
    // console.log(data);
    if (error) return {ok: false};

    return {ok: true, data: data, count: count};
}

export async function getCompRounds(comp_id) {
    const { data, error } = await supabase.from('COMPETITION_ROUNDS').select('*').eq('competition_id', comp_id);
    if (error) return {ok: false};

    return {ok: true, data: data};
}

export async function getCompInfoTabs(comp_id) {
    const { data, error } = await supabase.from('COMPETITION_INFO_TABS').select('*').eq('competition_id', comp_id);
    if (error) return {ok: false};

    return {ok: true, data: data};
}


export async function editComp(compData) {
    const {compId, compName, compVenueName, compVenueAddress, compMode, compRegFromDate, compRegTillDate, compFromDate, compTillDate, compCompetitorLimit, compEventRounds, compInfoTabs} = compData;
    
    const session = await fetch(`/api/session?user=${encodeURIComponent('organiser_session')}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const sessionData = await session.json();
    const organiserId = sessionData.userId;

    let { data, error } = await supabase.from('COMPETITIONS')
        .update([
            {
                name: compName, venue: compVenueName, venue_address: compVenueAddress, competition_mode: compMode,
                organiser: organiserId, registration_from_date: compRegFromDate, registration_till_date: compRegTillDate,
                from_date: compFromDate, till_date: compTillDate, competitors_limit: compCompetitorLimit
             },
        ])
        .eq("id", compId)
        .select();
    // console.log(data);
    if (error) return {ok: false};

    // const compId = data[0].id;

    // add prefix {compId} to the event rounds' string_id
    // console.log(compEventRounds);
    // console.log(compInfoTabs);

    const eventIds = Object.getOwnPropertyNames(compEventRounds);

    for (let i = 0; i < eventIds.length; i++) {
        const eventId = eventIds[i];

        for (let j = 0; j < compEventRounds[eventId].length; j++) {
            compEventRounds[eventId][j].str_id = `${compId}-${eventId}-${j+1}`;

            if (j < compEventRounds[eventId].length - 1) {
                compEventRounds[eventId][j].next_round = `${compId}-${eventId}-${j+2}`;
            }
        }
    }

    // console.log(compEventRounds);
    // console.log(compInfoTabs);

    let eventRoundsToInsert = [];
    let infoTabsToInsert = [];

    for (let i = 0; i < eventIds.length; i++) {
        const eventId = eventIds[i];
        for (let j = 0; j < compEventRounds[eventId].length; j++) {
            let recordToInsert = compEventRounds[eventId][j];

            eventRoundsToInsert.push({
                competition_id: compId,
                event_id: recordToInsert.event_id,
                format_id: recordToInsert.format_id,
                name: recordToInsert.name,
                to_advance: recordToInsert.to_advance,
                is_not_round: recordToInsert.is_not_round,
                time_limit: recordToInsert.time_limit,
                from_datetime: recordToInsert.from_datetime,
                till_datetime: recordToInsert.till_datetime,
                cutoff: recordToInsert.cutoff,
                string_id: recordToInsert.str_id,
                next_round: recordToInsert.next_round
            });
        }
    }

    for (let i = 0; i < compInfoTabs.length; i++) {
        let recordToInsert = compInfoTabs[i];

        infoTabsToInsert.push({
            competition_id: compId,
            name: recordToInsert.name,
            info_text: recordToInsert.info_text
        });
    }

    // remove all old rounds and tabs
    const roundResponse = await supabase.from('COMPETITION_ROUNDS').delete().eq('competition_id', compId);
    const tabResponse = await supabase.from('COMPETITION_INFO_TABS').delete().eq('competition_id', compId);

    // insert rounds and tabs
    let { rounddata, rounderror } = await supabase.from('COMPETITION_ROUNDS')
        .insert(eventRoundsToInsert)
        .select();

    let { tabdata, taberror } = await supabase.from('COMPETITION_INFO_TABS')
        .insert(infoTabsToInsert)
        .select();

    return {ok: true};
}

export async function getCompRegistrationDataByOrganiserId() {
    const session = await fetch(`/api/session?user=${encodeURIComponent('organiser_session')}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const sessionData = await session.json();
    const organiserId = sessionData.userId;

    const registrationData = await supabase.from('REGISTRATIONS')
        .select(`
            *,
            COMPETITIONS!inner(id,name,organiser),
            PERSONS(id,name,gender,dob,wcaid,email)
        `)
        .eq('COMPETITIONS.organiser', organiserId);

    if (registrationData.error) return {ok: false};

    const groupedRegistrationData = Object.values(registrationData.data.reduce((acc, item) => {
        const key = item.COMPETITIONS.id;

        if (!acc[key]) {
            acc[key] = {
                comp_id: key,
                comp_name: item.COMPETITIONS.name,
                approved: 0,
                pending: 0,
                request_cancel: 0,
                data: []
            };
        }

        if (item.status === 0) acc[key].pending++;
        else if (item.status === 1) acc[key].approved++;
        else if (item.status === 3) acc[key].request_cancel++;

        acc[key].data.push(item);

        return acc;
    }, {})).sort((a, b) => b.comp_id - a.comp_id);

    // console.log(groupedRegistrationData);

    return {
        ok: true,
        data: groupedRegistrationData
    }
}

export async function getCompRegistrationDataByCompId(comp_id) {
    const registrationData = await supabase.from('REGISTRATIONS')
        .select(`
            *,
            COMPETITIONS!inner(id, name),
            REGISTRATION_EVENTS!inner(id,registration_id,event_id,EVENTS(id,name,is_official)),
            PERSONS(id,name,gender,dob,email)
        `)
        .eq('COMPETITIONS.id', comp_id);

    if (registrationData.error) return {ok: false};

    

    // console.log(registrationData);
    const returnData = registrationData.data.sort((a, b) => a.id - b.id);

    return {
        ok: true,
        data: returnData
    }
}

export async function updateRegistration({ registration }) {
    if (registration.length < 1) return {ok: true};

    for (let i = 0; i < registration.length; i++) {
        const { error } = await supabase
            .from('REGISTRATIONS')
            .update({ status: registration[i].status })
            .eq('id', registration[i].id);

        if (error) return {ok: false};
    }

    // now check for competitors limit and change some registration from confirmed to waitlist
    const compData = await supabase.from('REGISTRATIONS')
        .select(`competition_id`)
        .eq('id', registration[0].id);
    if (compData.error) return {ok: false};

    const registrationData = await supabase.from('REGISTRATIONS')
        .select(`
            *,
            COMPETITIONS(competitors_limit)
        `)
        .eq('competition_id', compData.data[0].competition_id)
        .eq('status', 1);
    
    console.log(registrationData);

    if (registrationData.data.length < 1) return {ok: true};

    let registrationsArray = registrationData.data;
    registrationsArray.sort((a, b) => new Date(a.last_update_at) - new Date(b.last_update_at));
    const spare_out = registrationsArray.length - registrationData.data[0].COMPETITIONS.competitors_limit;

    if (spare_out < 1) return {ok: true};

    for (let i = 0; i < spare_out; i++) {
        const { error } = await supabase
            .from('REGISTRATIONS')
            .update({ status: 2 })
            .eq('id', registrationsArray[registrationsArray.length - 1 - i].id);

        if (error) return {ok: false};
    }

    return {ok: true};
}