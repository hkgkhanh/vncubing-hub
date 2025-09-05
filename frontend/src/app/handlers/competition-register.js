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

    return {ok: true, data: data.length > 0};
}