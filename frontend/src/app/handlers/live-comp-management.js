import { supabase } from '@/app/utils/supabase';

export async function getRoundsList(comp_id) {
    let competitionData = await supabase.from('COMPETITIONS')
        .select(`
            *,
            COMPETITION_ROUNDS(*, EVENTS(id, name, is_official), FORMATS(*))
        `)
        .eq('id', comp_id);

    if (competitionData.error) return {ok: false};

    let returnData = competitionData.data[0];

    let eventsData = returnData.COMPETITION_ROUNDS.filter(row => row.is_not_round === false && row.event_id != null).map(row => ({
        event_id: row.event_id,
        is_official: row.EVENTS?.is_official ?? false,
        name: row.EVENTS?.name ?? null
    }));

    let roundsData = returnData.COMPETITION_ROUNDS.filter(row => row.is_not_round === false && row.event_id != null);

    const unique = Array.from(new Map(eventsData.map(item => [item.event_id, item])).values());

    const competitorsData = await supabase.from('REGISTRATIONS')
        .select(`
            *,
            COMPETITIONS!inner(id),
            REGISTRATION_EVENTS!inner(id,registration_id,event_id,EVENTS(id,name,is_official)),
            PERSONS(id,name)
        `)
        .eq('COMPETITIONS.id', comp_id);
    if (competitorsData.error) return {ok: false};
    // console.log(competitorsData.data);

    let rounds_to_check_results = [];

    for (let i = 0; i < roundsData.length; i++) {
        let round_number = roundsData[i].string_id.split("-").at(-1);
        roundsData[i]['competitors'] = [];

        let name_parts = roundsData[i].name.split(" ");
        roundsData[i].name = `${name_parts[name_parts.length - 2]} ${name_parts[name_parts.length - 1]}`;

        if (roundsData[i].next_round == null) roundsData[i].name = "chung kết";

        if (roundsData[i].operation_status == 1 && roundsData[i].next_round != null) rounds_to_check_results.push(roundsData[i].next_round);
        
        if (round_number == '1') {
            let tempRes = await supabase.from('TEMP_RESULTS')
                .select(`*`)
                .eq('round_id', roundsData[i].id);

            for (let j = 0; j < competitorsData.data.length; j++) {
                for (let k = 0; k < competitorsData.data[j].REGISTRATION_EVENTS.length; k++) {
                    if (competitorsData.data[j].REGISTRATION_EVENTS[k].event_id != roundsData[i].event_id) continue;

                    let temp_results = [0, 0, 0, 0, 0];
                    const resultRow = tempRes.data.find(r => r.person_id === competitorsData.data[j].PERSONS.id);

                    if (resultRow) {
                        temp_results = [
                            resultRow.value1,
                            resultRow.value2,
                            resultRow.value3,
                            resultRow.value4,
                            resultRow.value5
                        ]
                    }

                    roundsData[i]['competitors'].push({
                        person_id: competitorsData.data[j].PERSONS.id,
                        person_name: competitorsData.data[j].PERSONS.name,
                        results: temp_results
                    });
                }
            }
        }
    }

    // console.log(rounds_to_check_results);

    for (let i = 0; i < rounds_to_check_results.length; i++) {
        let round_string_id = rounds_to_check_results[i];

        for (let j = 0; j < roundsData.length; j++) {
            if (roundsData[j].string_id != round_string_id) continue;

            let tempRes = await supabase.from('TEMP_RESULTS')
                .select(`
                    *,
                    PERSONS!inner(id,name)
                `)
                .eq('round_id', roundsData[j].id);

            for (let k = 0; k < tempRes.data.length; k++) {
                roundsData[i]['competitors'].push({
                    person_id: tempRes.data[j].PERSONS.id,
                    person_name: tempRes.data[j].PERSONS.name,
                    results: [
                        tempRes.data[j].value1,
                        tempRes.data[j].value2,
                        tempRes.data[j].value3,
                        tempRes.data[j].value4,
                        tempRes.data[j].value5,
                    ]
                });
            }
        }
    }

    return {ok: true, data: roundsData, comp_events: unique};
}

export async function sendSolveToTempResults(round_id, person_id, solve_index, newVal) {
    const columnName = `value${solve_index + 1}`;
    const { data, error } = await supabase
        .from('TEMP_RESULTS')
        .upsert({
            round_id: round_id,
            person_id: person_id,
            [columnName]: newVal
        })
        .select();
    
    if (error) return { ok: false };
    return { ok: true };
}

export async function sendToNextRound(round_id, person_id, checked) {
    const { data, error } = await supabase
        .from('TEMP_RESULTS')
        .upsert({
            round_id: round_id,
            person_id: person_id,
            to_next_round: checked
        })
        .select();
    
    if (error) return { ok: false };
    return { ok: true };
}

export async function sendTopToAdvanceToNextRound(round_id, competitors_list) {
    let dataToUpsert = [];
    for (let i = 0; i < competitors_list.length; i++) {
        dataToUpsert.push({
            round_id: round_id,
            person_id: competitors_list[i].person_id,
            to_next_round: competitors_list[i].to_next_round
        });
    }
    const { data, error } = await supabase
        .from('TEMP_RESULTS')
        .upsert(dataToUpsert)
        .select();
    
    if (error) return { ok: false };
    return { ok: true };
}