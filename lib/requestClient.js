import { REST, RequestData } from "@razulmao/rest";
import CreateGuild from "./structures/CreateGuild";

class RequestClient extends REST {
    client = new REST();
    authPrefix = "Bot";

    constructor(
        token,
        options = {
            authPrefix: "Bot",
        }
    ) {
        super();
        if (token) this.client.setToken(token);
        this.authPrefix = options.authPrefix;

        this.client.on("request", (request) => {
            console.log(
                `[DISCORD] ${request.route} ${request.method} ${request.retries}`
            );
        });
    }

    /**
     *
     * @param {RequestData} options
     * @returns
     */
    async fetchMe(options) {
        return this.client.get("/users/@me", options);
    }

    async exchangeTokenAsInstantRestore(code) {
        return this.client.post(`/oauth2/token`, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            auth: false,
            body: new URLSearchParams({
                client_id: process.env.TEMP_CLIENT_ID,
                client_secret: process.env.TEMP_CLIENT_SECRET,
                grant_type: "authorization_code",
                redirect_uri: process.env.TEMP_REDIRECT_URI,
                code: code,
            }),
            passThroughBody: true,
        });
    }

    async exchangeTokenAsCustomDomain(code) {
        return this.client.post(`/oauth2/token`, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            auth: false,
            body: new URLSearchParams({
                client_id: process.env.NEW_BOT_ID,
                client_secret: process.env.NEW_BOT_CLIENT_SECRET,
                grant_type: "authorization_code",
                redirect_uri: process.env.CUSTOM_REDIRECT_URI,
                code: code,
            }),
            passThroughBody: true,
        });
    }

    async exchangeToken(code, app = false) {
        return this.client.post(`/oauth2/token`, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            auth: false,
            body: new URLSearchParams({
                client_id: process.env.NEW_BOT_ID,
                client_secret: process.env.NEW_BOT_CLIENT_SECRET,
                grant_type: "authorization_code",
                redirect_uri: app
                    ? process.env.APP_REDIRECT_URI
                    : process.env.REDIRECT_URI,
                code: code,
            }),
            passThroughBody: true,
        });
    }

    /**
     *
     * @param {URLSearchParams} query
     * @returns
     */
    async fetchGuilds(query) {
        return this.client.get(`/users/@me/guilds${query ? query : ""}`, {
            authPrefix: this.authPrefix,
        });
    }

    async fetchGuildMembers(guildID) {
        return this.client.get(`/guilds/${guildID}/members`);
    }

    async fetchGuild(
        guildID,
        options = {
            WITH_COUNT: true,
        }
    ) {
        return this.client.get(
            `/guilds/${guildID}${
                options.WITH_COUNT ? "?with_counts=true" : ""
            }`,
            {
                authPrefix: this.authPrefix,
            }
        );
    }

    async fetchGatewayBot() {
        return this.client.get("/gateway/bot");
    }

    /**
     *
     * @param {String} guildID
     * @returns
     */
    async fetchRolesFromGuild(guildID) {
        return this.client.get(`/guilds/${guildID}/roles`);
    }

    /**
     *
     * @param {String} guildID
     * @param {String} userID
     */
    async fetchMemberFromGuild(guildID, userID) {
        return this.client.get(`/guilds/${guildID}/members/${userID}`);
    }

    /**
     *
     * @param {String} guildID
     * @returns
     */
    async fetchChannelsFromGuild(guildID) {
        return this.client.get(`/guilds/${guildID}/channels`);
    }

    /**
     *
     * @param {String} guildID
     * @param {String} accessToken
     */
    async addMemberToGuild(
        guildID,
        userID,
        accessToken,
        options = {
            role_ids: [],
        }
    ) {
        return this.client.put(`/guilds/${guildID}/members/${userID}`, {
            body: {
                access_token: accessToken,
                roles: options.role_ids,
            },
        });
    }

    async refreshToken(data) {
        return this.client.post("/oauth2/token", {
            body: new URLSearchParams(data),
            auth: false,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            passThroughBody: true,
        });
    }

    /**
     *
     * @param {CreateGuild} data
     * @returns
     */
    async createGuild(data) {
        return this.client.post("/guilds", {
            body: data,
        });
    }

    async giveOwnership(guildId, userId) {
        return this.client.patch(`/guilds/${guildId}`, {
            body: {
                owner_id: userId,
            },
        });
    }

    async leaveGuild(guildId) {
        return this.client.delete(`/users/@me/guilds/${guildId}`);
    }

    async deleteGuild(guildId) {
        return this.client.delete(`/guilds/${guildId}`);
    }

    async sendMessage(channelId, body) {
        return this.client.post(`/channels/${channelId}/messages`, {
            body,
        });
    }

    async addRole(
        guildId,
        userId,
        roleId,
        options = {
            reason: "Verification",
        }
    ) {
        return this.client.put(
            `/guilds/${guildId}/members/${userId}/roles/${roleId}`,
            {
                reason: options.reason,
            }
        );
    }
}

export default RequestClient;
