import axios from "axios";

class CustomBotsHandler {
    token;
    url = "http://localhost:8080/api";

    constructor({ url }) {
        if (url) this.url = url;
    }

    setToken(token) {
        this.token = token;
    }

    /**
     *
     * @param {`/${string}`} route
     * @param {import("axios").AxiosRequestConfig<any>} options
     */
    get(route, options) {
        return axios.get(`${this.url}${route}`, {
            ...options,
        });
    }
    /**
     *
     * @param {`/${string}`} route
     * @param {any} data
     * @param {import("axios").AxiosRequestConfig<any>} options
     */
    post(route, data, options) {
        return axios.post(`${this.url}${route}`, data, {
            ...options,
        });
    }

    /**
     *
     * @param {`/${string}`} route
     * @param {any} data
     * @param {import("axios").AxiosRequestConfig<any>} options
     */
    patch(route, data, options) {
        return axios.patch(`${this.url}${route}`, data, {
            ...options,
        });
    }

    /**
     *
     * @param {`/${string}`} route
     * @param {RequestInit} options
     */
    delete(route, options) {
        return axios.delete(`${this.url}${route}`, {
            ...options,
        });
    }

    /**
     *
     * @param {`/${string}`} route
     * @param {any} body
     * @param {RequestInit} options
     */
    put(route, body, options) {
        return axios.put(`${this.url}${route}`, body, {
            ...options,
        });
    }
}

export default CustomBotsHandler;
