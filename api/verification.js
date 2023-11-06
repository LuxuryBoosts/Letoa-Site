import { LetoaDiscordAPIErrors } from "../lib/codes";
import VerificationError from "../errors/Verification";

import axios from "axios";

const {
    INVALID_GUILD,
    USER_NOT_LOGGED_IN,
    SETUP_NOT_VALID,
    MEMBER_NOT_IN_SERVER,
} = LetoaDiscordAPIErrors;

export const getGuildVerification = async ({ queryKey }) => {
    const [, { Authorization, GuildID }] = queryKey;

    const res = await axios.get(`/api/v1/verification/${GuildID}`, {
        headers: Authorization ? { Authorization } : {},
    });

    if (res.status === 401) {
        throw new VerificationError(
            "USER_NOT_LOGGED_IN",
            "You must be logged in to continue"
        );
    }

    if (res.status !== 200) {
        throw new Error(res.statusText);
    }

    switch (res.data.code) {
        case MEMBER_NOT_IN_SERVER:
            throw new VerificationError(
                "MEMBER_NOT_IN_SERVER",
                res.data.message
            );
        case INVALID_GUILD:
            throw new VerificationError(
                "INVALID_GUILD",
                "Invalid Guild Provided"
            );
        case USER_NOT_LOGGED_IN:
            throw new VerificationError(
                "USER_NOT_LOGGED_IN",
                "You must be logged in to continue"
            );
        case SETUP_NOT_VALID:
            throw new VerificationError(
                "SETUP_INVALID",
                "Contact server admins to configure settings"
            );
        case 401:
            throw new VerificationError(
                "USER_NOT_LOGGED_IN",
                "You must be logged in to continue"
            );
    }

    return res.data;
};
