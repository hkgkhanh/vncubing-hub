import { supabase } from '@/app/utils/supabase';
import { WCALogin } from '@/app/handlers/auth';

// CREATE
export async function createPerson(data) {
    try {
        const res = await fetch("/api/vnca/create-person", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: data.name,
                gender: data.gender,
                dob: data.dob,
                wcaid: data.wcaid,
                email: data.email,
                hashed_password: data.hashed_password,
            }),
        });

        const result = await res.json();

        if (!res.ok) {
            console.error("Server error:", result.error);
            return;
        }

        // console.log("Person created:", result.person);
        return result.person;
    } catch (err) {
        console.error("Unexpected error:", err);
    }
}

// READ
export async function getPersons() {
    const { data, error } = await supabase.from("PERSONS").select("*");
    if (error) throw error;
    return data;
}

export async function getPersonByWcaid(wca_id) {
    const { data, error } = await supabase.from('PERSONS').select("*").eq('wcaid', `${wca_id}`);
    if (error) throw error;
    return data;
}

export async function getPersonByWcaidOrEmail(wca_id, email) {
    const { data, error } = await supabase.from('PERSONS').select("*").or(`wcaid.eq.${wca_id},email.eq.${email}`);
    if (error) throw error;
    return data;
}

export async function getPersonByEmail(email) {
    const { data, error } = await supabase.from('PERSONS').select("*").eq('email', `${email}`);
    if (error) throw error;
    // console.log(email);
    return data;
}

// UPDATE
export async function updatePerson(id, updates) {
    const { data, error } = await supabase
      .from("PERSONS")
      .update(updates)
      .eq("id", id)
      .select();
    if (error) throw error;
    return data[0];
}

export async function updatePassword({ email, hashed_password }) {
    const { status, statusText } = await supabase.from('PERSONS').update({ hashed_password: `${hashed_password}` }).eq('email', `${email}`);
    // console.log(status);
    // if (error) throw error;
    return status;
}

// DELETE
export async function deletePerson(id) {
    const { error } = await supabase.from("PERSONS").delete().eq("id", id);
    if (error) throw error;
    return { success: true };
}

export async function directWCALogin(data) {
    // console.log(data);
    const res = await supabase.from("PERSONS").upsert(data, { onConflict: "email" }).select();
    // console.log(res);

    if (res.error) return { ok: false };
    const loginData = await WCALogin({ email: res.data[0].email });
    if (!loginData.ok) return { ok: false };
    return { ok: true };
}

export async function getPersonVncaInfoById(person_id) {
    try {
        const res = await fetch("/api/vnca/person", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ person_id: person_id }),
        });

        const result = await res.json();
        // console.log(result);

        if (!res.ok) {
            console.error("Server error:", result.error);
            return { ok: false };
        }

        // console.log("Person created:", result.person);
        return {
            ok: true,
            data: result
        };
    } catch (err) {
        console.error("Unexpected error:", err);
    }
}

export async function getPersonWcaInfoById(wcaid) {
    try {
        const res = await fetch("/api/wca/person", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ wcaid: wcaid }),
        });

        const result = await res.json();
        // console.log(result);

        if (!res.ok) {
            console.error("Server error:", result.error);
            return { ok: false };
        }

        // console.log("Person created:", result.person);
        return {
            ok: true,
            data: result
        };
    } catch (err) {
        console.error("Unexpected error:", err);
    }
}

export async function getPersonNameAndId() {
    try {
        const res = await fetch("/api/session/person", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const result = await res.json();
        // console.log(result);

        if (!res.ok) {
            console.error("Server error:", result.error);
            return { ok: false };
        }

        const personData = await supabase.from("PERSONS").select("name,id").eq('id', result.data);
        if (personData.error) return { ok: false };

        // console.log("Person created:", result.person);
        return {
            ok: true,
            data: personData.data[0]
        };
    } catch (err) {
        console.error("Unexpected error:", err);
    }
}