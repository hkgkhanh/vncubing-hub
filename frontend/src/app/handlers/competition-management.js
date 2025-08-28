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