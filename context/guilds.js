import { createContext, useContext, useState, useEffect } from "react";
import { useToken } from "./token";
import useApi from "../hooks/api";

const Context = createContext(false);

export const GuildsProvider = ({ children }) => {
    const { data: guilds, error } = useApi({
        path: "/api/v1/users/@me",
        requiresToken: true,
        redirectUnauthorized: false,
    });

    return <Context.Provider value={guilds}>{children}</Context.Provider>;
};

export function useGuilds() {
    return useContext(Context);
}
