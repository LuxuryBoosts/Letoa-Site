import BotNotAdded from "../errors/BotNotAdded";
import DiscordError from "../errors/DiscordError";
import UnAuthorized from "../errors/UnAuthorized";

/**
 *
 * @param {String} error
 * @returns {"UNAUTHORIZED" | "BOT_NOT_ADDED" | "DISCORD_ERROR"}
 */
export const returnError = (error) => {
    const newError = error.toString().toLowerCase().split(":")[0];
    switch (newError) {
        case "unauthorized":
            return "UNAUTHORIZED";
        case "botnotadded":
            return "BOT_NOT_ADDED";
        case "discorderror":
            return "DISCORD_ERROR";
    }
};
