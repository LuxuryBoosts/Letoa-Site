import { useRouter } from "next/router";
import Header from "./Header";
import HeadTag from "./HeadTag";

export const ErrorHeadTag = ({
    title = "Desipher ― Error",
    meta = {
        description: "The Recovery Of Discord Servers.",
        image: "/logo.png",
    },
}) => {
    return (
        <>
            <HeadTag
                title={title}
                description={meta.description}
                image={meta.image}
            />
        </>
    );
};

export const ProxyVpnDetected = () => {
    return (
        <>
            <ErrorHeadTag
                meta={{
                    description: `Login to verify in this server.`,
                }}
            />
            <Header />
            <div className="head">
                <div className="banner-textarea">
                    <div className="banner-title">
                        <span style={{ fontWeight: 500 }}>PROXY DETECTED</span>
                        <div className="banner-slogan-2">
                            We have detected a VPN / Proxy connection. Please
                            disable your proxy or vpn to continue.
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export const UserNotLoggedIn = ({ serverName = "Unknown" }) => {
    const router = useRouter();

    return (
        <>
            <ErrorHeadTag
                meta={{
                    description: `Login to verify in ${
                        serverName ? serverName : "this server."
                    }`,
                }}
            />
            <Header />
            <div className="head">
                <div className="banner-textarea">
                    <div className="banner-title">
                        <span style={{ fontWeight: 500 }}>LOGIN</span>
                    </div>
                    <div className="banner-slogan-2">
                        You must login before accessing the verification page.
                    </div>
                    <div className="center">
                        <div
                            className="box-remove-large"
                            onClick={() => {
                                window.localStorage.removeItem("token");
                                router.push(
                                    `/link/discord?redirect=${window.location.toString()}&verification=true`
                                );
                            }}
                        >
                            LOGIN
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export const InvalidRole = () => {
    return (
        <>
            <ErrorHeadTag />
            <Header />
            <div className="head">
                <div className="banner-textarea">
                    <div className="banner-title">
                        <span style={{ fontWeight: 500 }}>INVALID ROLE</span>
                        <div className="banner-slogan-2">
                            An invalid role was provided. Please contact admins
                            to update the verification role.
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export const InvalidGuild = () => {
    return (
        <>
            <ErrorHeadTag />
            <Header />
            <div className="head">
                <div className="banner-textarea">
                    <div className="banner-title">
                        <span style={{ fontWeight: 500 }}>INVALID GUILD</span>
                        <div className="banner-slogan-2">
                            An invalid server was provided. You can invite the
                            bot{" "}
                            <a href="/bot" style={{ color: "#fff" }}>
                                here
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export const SetupInvaild = () => {
    return (
        <>
            <ErrorHeadTag />
            <Header />
            <div className="head">
                <div className="banner-textarea">
                    <div className="banner-title">
                        <span style={{ fontWeight: 500 }}>SETUP INVALID</span>
                        <div className="banner-slogan-2">
                            The server config has not been setup. Please contact
                            server admins.
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export const MemberNotInServer = ({ message }) => {
    return (
        <>
            <ErrorHeadTag />
            <Header />
            <div className="head">
                <div className="banner-textarea">
                    <div className="banner-title">
                        <span style={{ fontWeight: 500 }}>ERROR</span>
                        <div className="banner-slogan-2">{message}</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export const UnknownError = () => {
    return (
        <>
            <HeadTag title={"Desipher ― Verification"} />
            <Header />
            <div className="head">
                <div className="banner-textarea">
                    <div className="banner-title">
                        <span style={{ fontWeight: 500 }}>UNKNOWN ERROR</span>
                        <div className="banner-slogan-2">
                            We have encountered an unknown error. Please join{" "}
                            <a href="/discord" style={{ color: "#fff" }}>
                                this server
                            </a>{" "}
                            to report it
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
