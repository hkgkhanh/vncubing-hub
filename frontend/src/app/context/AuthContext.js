"use client";

import { createContext, useContext } from "react";

export const AuthContext = createContext({
    isLoggedInPerson: false,
    isLoggedInOrganiser: false,
});

export function useAuth() {
    return useContext(AuthContext);
}