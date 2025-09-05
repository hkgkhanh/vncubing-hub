"use client";

import { AuthContext } from "@/app/context/AuthContext";

export function Provider({ children, isLoggedInPerson, isLoggedInOrganiser }) {
    return (
        <AuthContext.Provider value={{ isLoggedInPerson, isLoggedInOrganiser }}>
            {children}
        </AuthContext.Provider>
    );
}