const axios = require("axios");

module.exports = {
    sendAttackWebhook(rps) {
        axios.default.post(
            process.env.CF_ATTACK_WEBHOOK,
            {
                embeds: [
                    {
                        title: "DDoS Detected",
                        username: "Letoa Mitigation",
                        color: 1075398,
                        footer: {
                            text: "Letoa Mitigation",
                        },
                        description: `A HTTP DDoS attack has been triggered on the host desipher.io. The attack is currently outgoing \`${rps}\` requests per second.`,
                        image: {
                            url: "https://minecraft-api.com/api/achivements/firework_rocket/Letoa..DDoS..Detection/Some..ape..tried..to..bbos",
                        },
                    },
                ],
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    },

    sendFinishAttackWebhook() {
        axios.default.post(
            process.env.CF_ATTACK_WEBHOOK,
            {
                embeds: [
                    {
                        title: "DDoS Detected",
                        username: "Letoa Mitigation",
                        color: 1075398,
                        footer: {
                            text: "Letoa Mitigation",
                        },
                        description:
                            "The current attack has stopped. All current services are functioning well.",
                    },
                ],
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    },
};
