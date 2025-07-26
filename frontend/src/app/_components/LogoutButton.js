"use client";

import { useRouter } from "next/navigation";
import navbarData from "@/data/header.json";

export default function LogoutButton() {
    const lang = "vi";
    const router = useRouter();
    const authLinks = navbarData['auth'];

    const handleLogout = async () => {
        await fetch("/api/logout", { method: "POST" });
        // router.replace("/"); // Or redirect to homepage
        router.refresh();
    };

    return (
        <a onClick={handleLogout}>
            {lang === 'vi' ? authLinks.logout.label_vi : authLinks.logout.label_en}
        </a>
    );
}