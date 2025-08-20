import { supabase } from '@/app/utils/supabase';

export async function getAllEvents() {
    const { data, error } = await supabase.from('EVENTS').select("*");
    if (error) throw error;
    return data;
}

export async function getWcaEvents() {
    const { data, error } = await supabase.from('EVENTS').select("*").eq('is_official', 'TRUE');
    if (error) throw error;
    return data;
}

export async function getNonWcaEvents() {
    const { data, error } = await supabase.from('EVENTS').select("*").eq('is_official', 'FALSE');
    if (error) throw error;
    return data;
}