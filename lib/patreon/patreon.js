import fetch from "isomorphic-fetch";
import {
    normalizeRequest,
    checkStatus,
    getJson,
    userAgentString,
} from "./utils";

function patreon(accessToken) {
    const makeRequest = (requestSpec) => {
        const normalizedRequest = normalizeRequest(requestSpec);
        const url = normalizedRequest.url;
        const options = {
            ...normalizedRequest,
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "User-Agent": userAgentString(),
            },
            credentials: "include",
        };
        let _response = undefined;

        return fetch(url, options)
            .then((response) => {
                _response = response;
                return checkStatus(response);
            })
            .then(getJson)
            .then((rawJson) => {
                return { rawJson, response: _response };
            })
            .catch((error) => {
                return Promise.reject({ error, response: _response });
            });
    };
    return makeRequest;
}

export default patreon;
