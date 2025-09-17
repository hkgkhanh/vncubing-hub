'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import '../../_styles/login/default.css';
import { getPersonNameAndId } from "@/app/handlers/person";
import { nameToSlug } from "@/app/utils/codeGen";

function RedirectProfilePage() {
    const router = useRouter();
    const { isLoggedInPerson, isLoggedInOrganiser } = useAuth();

    useEffect(() => {
        async function handleRedirectToProfile() {
            if (isLoggedInPerson) {
                const res = await getPersonNameAndId();
                if (!res.ok) {
                    alert("Có lỗi xảy ra, vui lòng thử lại.");
                    return;
                }

                // console.log(res.data);

                router.replace(`/persons/${nameToSlug(res.data.name, res.data.id)}`);
                router.refresh();
        }
        }

        handleRedirectToProfile();
    }, []);

    if (!isLoggedInPerson && !isLoggedInOrganiser) {
        router.replace('/');
        router.refresh();
    }

    return (
        <div className='spinner-container'>
            <img
                src="/ui/spinner.svg"
                alt="Loading"
                className="spinner"
                title="Loading"
            />
        </div>
    );
}

export default RedirectProfilePage;