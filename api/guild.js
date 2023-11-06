import axios from "axios";
import DiscordError from "../errors/DiscordError";
import UnAuthorized from "../errors/UnAuthorized";
import BotNotAdded from "../errors/BotNotAdded";
import { LetoaDiscordAPIErrors } from "../lib/codes";

export const getGuildInfo = async ({ queryKey }) => {
    const [, { Authorization, GuildID }] = queryKey;

    if (!GuildID) {
        return;
    }

    const res = await axios.get(`/api/v1/guilds/${GuildID}`, {
        headers: { Authorization },
    });

    if (res.data.code === LetoaDiscordAPIErrors.BOT_NOT_IN_SERVER) {
        throw new BotNotAdded("Bot Not Added");
    }
    if (res.data.code === LetoaDiscordAPIErrors.MISSING_ACCESS) {
        throw new UnAuthorized("Missing Access");
    }

    if (res.data.code === LetoaDiscordAPIErrors.DISCORD_NOT_LINKED) {
        throw new DiscordError("Discord Not Authorized");
    }

    if (res.status !== 200) {
        throw new Error(res.statusText);
    }
    return res.data;
};
