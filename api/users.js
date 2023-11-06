import axios from "axios";
import DiscordError from "../errors/DiscordError";
import { LetoaDiscordAPIErrors } from "../lib/codes";

export const getUserBackups = async ({ queryKey }) => {
    const [, { Authorization }] = queryKey;

    const res = await axios.get(`/api/v1/users/@me/backups`, {
        headers: { Authorization },
    });

    if (res.data.code === LetoaDiscordAPIErrors.DISCORD_NOT_LINKED) {
        throw new DiscordError("Discord Not Authorized");
    }

    if (res.status !== 200) {
        window.localStorage.removeItem("token");
        throw new Error(res.statusText);
    }

    return res.data;
};

export const getUserVerifiedUsers = async ({ queryKey }) => {
    const [, { Authorization }] = queryKey;

    const res = await axios.get(`/api/v1/users/@me/users`, {
        headers: { Authorization },
    });

    if (res.data.code === LetoaDiscordAPIErrors.DISCORD_NOT_LINKED) {
        throw new DiscordError("Discord Not Authorized");
    }

    if (res.status !== 200) {
        window.localStorage.removeItem("token");
        throw new Error(res.statusText);
    }

    return res.data;
};

export const getUserLinked = async ({ queryKey }) => {
    const [, { Authorization }] = queryKey;
    const res = await axios.get(`/api/v1/users/@me/linked`, {
        headers: { Authorization },
    });

    if (res.data.code === LetoaDiscordAPIErrors.DISCORD_NOT_LINKED) {
        throw new DiscordError("Discord Not Authorized");
    }

    if (res.status !== 200) {
        window.localStorage.removeItem("token");
        throw new Error(res.statusText);
    }

    return res.data;
};

export const getUser = async ({ queryKey }) => {
    const [, { Authorization, query = "" }] = queryKey;
    const res = await axios.get(`/api/v1/users/@me${query}`, {
        headers: { Authorization },
    });

    if (res.data.code === LetoaDiscordAPIErrors.DISCORD_NOT_LINKED) {
        throw new DiscordError("Discord Not Authorized");
    }

    if (res.status !== 200) {
        window.localStorage.removeItem("token");
        throw new Error(res.statusText);
    }
    return res.data;
};
