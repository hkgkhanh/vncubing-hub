import { supabase } from '@/app/utils/supabase';

export async function checkRegisterForComp(comp_id) {
    const session = await fetch(`/api/session?user=${encodeURIComponent('person_session')}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const sessionData = await session.json();
    const personId = sessionData.userId;

    if (personId == null) return {ok: true, data: false};

    const { data, error } = await supabase.from('REGISTRATIONS').select('*').eq('person_id', personId).eq('competition_id', comp_id);
    if (error) return {ok: false};

    return {ok: true, data: data.length > 0, registrationStatus: data.length > 0 ? data[0].status : null};
}

export async function registerForComp({ comp_id, events, timestamp }) {
    const session = await fetch(`/api/session?user=${encodeURIComponent('person_session')}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const sessionData = await session.json();
    const personId = sessionData.userId;

    const { data, error } = await supabase.from('REGISTRATIONS')
        .insert([
            { competition_id: comp_id, person_id: personId, status: 0, last_update_at: timestamp },
        ])
        .select();

    if (error) return {ok: false};

    const registrationId = data[0].id;

    let recordsToInsert = [];
    let sortedEvents = [...events].sort();
    for (let i = 0; i < sortedEvents.length; i++) {
        recordsToInsert.push({
            registration_id: registrationId, event_id: sortedEvents[i]
        });
    }

    const response = await registerEvents(recordsToInsert);

    if (!response.ok) return {ok: false};
    return {ok: true};
}

export async function registerEvents(registration_events) {
    const { data, error } = await supabase.from('REGISTRATION_EVENTS')
        .insert(registration_events).select();

    if (error) return {ok: false};
    return {ok: true};
}

export async function getRegistrationForComp(comp_id) {
    const session = await fetch(`/api/session?user=${encodeURIComponent('person_session')}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const sessionData = await session.json();
    const personId = sessionData.userId;

    if (personId == null) return {ok: true, data: false};

    const { data, error } = await supabase.from('REGISTRATIONS').select('*').eq('person_id', personId).eq('competition_id', comp_id);
    if (error || data.length < 1) return {ok: false};

    const response = await getRegistrationEvents(data[0].id);

    if (!response.ok) return {ok: false};

    return {ok: true, data: response.data, registrationStatus: data[0].status};
}

export async function getRegistrationEvents(registration_id) {
    const { data, error } = await supabase.from('REGISTRATION_EVENTS').select('*').eq('registration_id', registration_id);

    if (error) return {ok: false};
    let events = [];
    for (let i = 0; i < data.length; i++) {
        events.push(data[i].event_id);
    }
    return {ok: true, data: events};
}

export async function editRegisterForComp({ comp_id, events, timestamp }) {
    const session = await fetch(`/api/session?user=${encodeURIComponent('person_session')}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const sessionData = await session.json();
    const personId = sessionData.userId;

    const exists = await supabase.from("REGISTRATIONS")
        .select()
        .eq("competition_id", comp_id)
        .eq("person_id", personId);

    if (exists.error || exists.data.length < 1) return {ok: false};

    const registrationId = exists.data[0].id;

    const { data, error } = await supabase.from('REGISTRATIONS')
        .update({ status: 0 }) // reset registration status to pending
        .eq('id', registrationId)
        .select();

    if (error) return {ok: false};

    await supabase.from('REGISTRATION_EVENTS').delete().eq('registration_id', registrationId);

    let recordsToInsert = [];
    let sortedEvents = [...events].sort();
    for (let i = 0; i < sortedEvents.length; i++) {
        recordsToInsert.push({
            registration_id: registrationId, event_id: sortedEvents[i]
        });
    }

    const response = await registerEvents(recordsToInsert);

    if (!response.ok) return {ok: false};
    return {ok: true};
}

export async function cancelRegisterForComp({ comp_id }) {
    const session = await fetch(`/api/session?user=${encodeURIComponent('person_session')}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const sessionData = await session.json();
    const personId = sessionData.userId;

    const exists = await supabase.from("REGISTRATIONS")
        .select()
        .eq("competition_id", comp_id)
        .eq("person_id", personId);

    if (exists.error || exists.data.length < 1) return {ok: false};

    const registrationId = exists.data[0].id;

    const { data, error } = await supabase.from('REGISTRATIONS')
        .update({ status: 3 }) // set registration status to requesting cancelation
        .eq('id', registrationId)
        .select();

    if (error) return {ok: false};
    return {ok: true};
}

export async function getRegistrationsListForComp({ comp_id }) {
    const { data, error } = await supabase.from('REGISTRATIONS')
        .select(`
            *,
            COMPETITIONS!inner(id, name),
            REGISTRATION_EVENTS!inner(id,registration_id,event_id,EVENTS(id,name,is_official)),
            PERSONS(id,name)
        `)
        .eq('COMPETITIONS.id', comp_id);
    if (error) return {ok: false};

    return {ok: true, data: data};
}