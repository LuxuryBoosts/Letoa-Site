import { useRouter } from "next/router";
import { useEffect } from "react";
import { useQuery } from "react-query";
import apiRequest from "../../api";
import { exchangeCode } from "../../api/exchange";
import Header from "../../components/Header";
import HeadTag from "../../components/HeadTag";
import { useToken } from "../../context/token";
import useApi from "../../hooks/api";
import { LetoaDiscordAPIErrors } from "../../lib/codes";

export async function getServerSideProps({ query }) {
    if (!query.code) {
        return {
            redirect: {
                destination: "/api/v1/auth/discord/redirect",
                permanent: false,
            },
        };
    } else if (query.guild_id && query.permissions) {
        return {
            props: {
                code: null,
                state: query.guild_id,
            },
        };
    } else {
        return {
            props: {
                code: query.code,
                state: query.state ? query.state : null,
            },
        };
    }
}

export default function DiscordLogin({ code, state }) {
    const router = useRouter();
    const [token, setToken] = useToken();

    if (!code && state && process.browser) {
        router.push(`/dashboard/servers/${state}`);
    }

    const { data, error } = useApi({
        method: "POST",
        path: "/api/v1/auth/exchange",
        data: {
            code: code,
            token: process.browser
                ? window.localStorage.getItem("token") ?? undefined
                : token ?? undefined,
        },
        depends: [code],
    });

    useEffect(() => {
        if (data) {
            setToken(data.token);
        }
    }, [data]);

    if (
        data &&
        data.code ===
            LetoaDiscordAPIErrors.ALREADY_LINKED_TO_ANOTHER_LETOA_ACCOUNT
    ) {
        return (
            <>
                <HeadTag title={"Desipher ― Error"} />
                <Header />
                <div className="head">
                    <div className="banner-textarea" data-aos="fade-down">
                        <div className="banner-title">
                            <span style={{ fontWeight: 500 }}>
                                We encountered an error.
                            </span>
                        </div>
                        <div className="banner-slogan">{data.message}</div>
                    </div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <HeadTag title={"Desipher ― Error"} />
                <Header />
                <div className="head">
                    <div className="banner-textarea" data-aos="fade-down">
                        <div className="banner-title">
                            <span style={{ fontWeight: 500 }}>
                                We encountered an error.
                            </span>
                        </div>
                        <div className="banner-slogan">Please try again.</div>
                    </div>
                </div>
            </>
        );
    }

    if (!data) {
        <>
            <HeadTag title="Desipher ― Login" />
            <Header />
            <div className="head">
                <div className="banner-textarea" data-aos="fade-down">
                    <div className="banner-title">
                        <span style={{ fontWeight: 500 }}>Logging You In.</span>
                    </div>
                    <div className="banner-slogan">
                        We are attempting to log you in
                    </div>
                </div>
            </div>
        </>;
    }

    if (
        process.browser &&
        data &&
        data.code !==
            LetoaDiscordAPIErrors.ALREADY_LINKED_TO_ANOTHER_LETOA_ACCOUNT
    ) {
        setTimeout(() => {
            router.push(state ? state : "/");
        }, 3000);

        return (
            <>
                <HeadTag title="Desipher ― Login" />
                <Header />
                <div className="head">
                    <div className="banner-textarea" data-aos="fade-down">
                        <div className="banner-title">
                            <span style={{ fontWeight: 500 }}>
                                Successfully Logged In
                            </span>
                        </div>
                        <div className="banner-slogan">
                            You will be redirected shortly.
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <HeadTag title="Desipher ― Login" />
            <Header />
            <div className="head">
                <div className="banner-textarea" data-aos="fade-down">
                    <div className="banner-title">
                        <span style={{ fontWeight: 500 }}>Logging You In.</span>
                    </div>
                    <div className="banner-slogan">
                        We are attempting to log you in
                    </div>
                </div>
            </div>
        </>
    );
}
