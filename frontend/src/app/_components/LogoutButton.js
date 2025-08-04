"use client";

import { useRouter } from "next/navigation";
import navbarData from "@/data/header.json";
import { logout } from "@/app/handlers/auth";

export default function LogoutButton() {
    const lang = "vi";
    const router = useRouter();
    const authLinks = navbarData['auth'];

    const handleLogout = async () => {
        // await fetch("/api/logout", { method: "POST" });
        const returnData = await logout();

        if (returnData.ok) {
            router.replace("/");
            router.refresh();
        }
    };

    return (
        <a onClick={handleLogout}>
            {lang === 'vi' ? authLinks.logout.label_vi : authLinks.logout.label_en}
        </a>
    );
}