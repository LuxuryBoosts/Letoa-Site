import { createContext, useContext, useState, useEffect } from "react";
import { useToken } from "./token";
import useApi from "../hooks/api";

const Context = createContext(false);

export const StatsProvider = ({ children }) => {
    const { data: user, error } = useApi({
        path: "/api/v1/stats",
        requiresToken: false,
        redirectUnauthorized: false,
    });

    return <Context.Provider value={user}>{children}</Context.Provider>;
};

export function useStats() {
    return useContext(Context);
}
