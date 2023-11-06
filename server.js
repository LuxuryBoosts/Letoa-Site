process.on("unhandledRejection", (err) => {
    console.error(err);
});
process.on("uncaughtException", (err) => {
    console.error(err);
});

const { createServer } = require("http");
const express = require("express");
const next = require("next");
const DatabaseClient = require("./lib/mongoose");
const CacheManager = require("./client/CacheClient");
const {
    sendFinishAttackWebhook,
    sendAttackWebhook,
} = require("./utils/discord");
const { changeSecurityLevel } = require("./utils/cloudflare");
const Sentry = require("@sentry/nextjs");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

var rps = 0;
var enabled = false;

nextApp.prepare().then(async () => {
    console.log("[API] Booting up the API");
    const app = express();
    const server = createServer(app);

    const blacklists = ["/_next/", "/assets/"];

    setInterval(() => {
        if (enabled) {
            setTimeout(() => {
                if (rps) rps = 0;
                console.log("[DDOS] Successfully cleared the RPS cache");
            }, 120000);
        } else {
            rps = 0;
            console.log("[DDOS] Successfully cleared the RPS cache");
        }
    }, 60000);

    app.disable("x-powered-by");

    app.use((req, res, next) => {
        req.cache = CacheManager;
        next();
    });

    app.use(express.json());

    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, Authorization"
        );
        if (req.method == "OPTIONS") {
            res.header(
                "Access-Control-Allow-Methods",
                "PUT, POST, PATCH, DELETE, GET"
            );
            return res.status(200).json({});
        }

        next();
    });

    /**
     *
     * @param {express.Request} req
     * @param {*} res
     * @param {*} next
     */
    let demoLogger = (req, res, next) => {
        let current_datetime = new Date();
        let formatted_date =
            current_datetime.getFullYear() +
            "-" +
            (current_datetime.getMonth() + 1) +
            "-" +
            current_datetime.getDate() +
            " " +
            current_datetime.getHours() +
            ":" +
            current_datetime.getMinutes() +
            ":" +
            current_datetime.getSeconds();
        let method = req.method;
        let url = req.url;
        let status = res.statusCode;
        let log = `[${formatted_date}] ${method}:${url} ${status} | RPS: ${rps}`;
        console.log(log, req.body);
        next();
    };

    /**
     *
     * @param {express.Request} req
     * @param {*} res
     * @param {*} next
     */
    const ddosHandler = (req, res, next) => {
        if (blacklists.includes(req.url)) return next();
        rps++;
        if (rps > 1000 && !enabled) {
            enabled = true;
            console.log(
                "[DDOS] Successfully enabled Under_Attack Mode via Cloudflare"
            );
            changeSecurityLevel("under_attack");
            setTimeout(() => {
                // sendAttackWebhook(rps);
            }, 5000);
        } else if (rps < 1000 && enabled) {
            console.log(
                "[DDOS] Successfully disabled Under_Attack Mode via Cloudflare"
            );
            // sendFinishAttackWebhook();
            // changeSecurityLevel("medium");
            enabled = false;
        }
        next();
    };

    app.use(ddosHandler);

    app.use(demoLogger);

    app.all("*", (req, res) => {
        return nextHandler(req, res);
    });

    server.listen(port, async (err) => {
        if (err) throw err;
        Sentry.init({
            dsn: "https://a5fe314ad6e448fdb1f7e602521211f7@o1292647.ingest.sentry.io/6514089",

            // Set tracesSampleRate to 1.0 to capture 100%
            // of transactions for performance monitoring.
            // We recommend adjusting this value in production
            tracesSampleRate: 1.0,
        });
        await DatabaseClient.connect(process.env.MONGODB_URI, {
            autoCreate: true,
            bufferCommands: true,
            user: process.env.MONGO_USERNAME,
            pass: process.env.MONGO_PASSWORD,
            authSource: process.env.MONGO_AUTH,
        });
        console.log(`Ready on http://127.0.0.1:${port}`);
    });
});
