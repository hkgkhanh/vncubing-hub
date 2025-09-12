import { supabase } from '@/app/utils/supabase';

export async function getOrganiserByEmail(email) {
    const { data, error } = await supabase.from('ADMINS').select("*").eq('email', `${email}`);
    if (error) throw error;
    return data;
}

export async function updatePassword({ email, hashed_password }) {
  const { status, statusText } = await supabase.from('ADMINS').update({ hashed_password: `${hashed_password}` }).eq('email', `${email}`);
  // console.log(status);
  // if (error) throw error;
  return status;
}