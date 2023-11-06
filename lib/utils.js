import { sendEmailCustom } from "./emailSender";
import DatabaseClient from "./mongoose";
import { generateGuildServerIcon } from "./cdn";
import axios from "axios";

export const sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
};

export const getPremiumImage = (config, account) => {
    if (account.premiumLevel !== 0) return config.customImage;
    else return null;
};

export const updateGuild = async (query, data) => {
    const d = await DatabaseClient.guilds.findOneAndUpdate(query, {
        name: data.name,
        iconURL: generateGuildServerIcon(data.id, data.icon),
    });
    return d;
};

/**
 *
 * @param {Object} data
 * @param {"user" | "guild"} options
 */
export const checkPremium = async (data, options = "user") => {
    if (options === "user") {
        const user = await DatabaseClient.logins.findOne(data);
        if (!user) return;
        if (user.premiumExpire <= Date.now() && user.premiumLevel !== 0) {
            sendEmailCustom(
                user.email,
                "Premium Expired ― Desipher",
                "Your Premium Subscription Ended",
                'Your premium has just expired! Don\'t stress about your members being lost as they will stay saved.<br>You may reactivate your premium <a href="https://desipher.io/premium">here</a>. Thank you for using <strong>Desipher</strong> and we hope you have a great time using it.'
            );
            await DatabaseClient.logins.findOneAndUpdate(
                {
                    accountID: user.accountID,
                },
                {
                    premiumLevel: 0,
                    premiumExpire: null,
                }
            );
            return;
        } else return;
    } else {
        return;
    }
};

/**
 * @description Get the activated server limit with premiumLevel
 * @param {number} premiumLevel
 */
export const getServerLimit = (premiumLevel) => {
    switch (premiumLevel) {
        case 1:
            return 5;
        case 2:
            return 10;
        case 3:
            return 25;
        default:
            return 0;
    }
};

/**
 * @description Get the Location of an IP
 * @param {String} ip
 */
export const getIPLocation = async (ip) => {
    try {
        const resp = await axios.get(`http://ip-api.com/json/${ip}`);
        if (resp.data.status !== "success") return null;
        else return resp.data;
    } catch (e) {
        return null;
    }
};

export const proxyGetIpLocation = async (ip) => {
    try {
        const resp = await axios.get(
            `https://proxycheck.io/v2/${ip}?key=${process.env.PROXY_CHECK_API_KEY}&risk=1&asn=1`
        );
        if (resp.data.status !== "ok") return null;
        const data = resp.data[ip];
        return data;
    } catch (e) {
        return null;
    }
};

/**
 * @description Sends an API request to proxycheck.io to get information about an IP.
 * @param {String} ip
 */
export const proxyCheck = async (ip) => {
    try {
        const resp = await axios.get(
            `https://proxycheck.io/v2/${ip}?key=${process.env.PROXY_CHECK_API_KEY}&risk=1&vpn=1&asn=1`
        );
        if (resp.data.status !== "ok") return true;
        const d = resp.data[ip];
        if (d.proxy !== "no" || d.type === "VPN") {
            return true;
        } else return false;
    } catch (e) {
        return null;
    }
};
