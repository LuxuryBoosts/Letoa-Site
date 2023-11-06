const NodeCache = require("node-cache");

class CacheClient {
    /**
     * @type {NodeCache}
     */
    client;

    /**
     *
     * @param {?NodeCache} client
     */
    constructor(client = null) {
        if (client) this.client = client;
        else this.client = new NodeCache({ stdTTL: 250 });

        console.log(
            `${new Date().toISOString()} - [MEMORY CACHE] Cache has been inititated!`
        );
    }

    /**
     *
     * @param {NodeCache.Key} key
     * @param {string | number | Buffer} value
     */
    setItem(key, value) {
        return this.client.set(key, value);
    }

    /**
     *
     * @param {NodeCache.Key} key
     */
    getItem(key) {
        return this.client.get(key);
    }

    /**
     *
     * @param {NodeCache.Key} key
     */
    deleteItem(key) {
        return this.client.del(key);
    }
}

const cache = new CacheClient();

module.exports = cache;
