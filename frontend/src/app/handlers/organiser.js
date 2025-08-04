import { supabase } from '@/app/utils/supabase';

export async function getOrganiserByEmail(email) {
    const { data, error } = await supabase.from('ADMINS').select("*").eq('email', `${email}`);
    if (error) throw error;
    return data;
}