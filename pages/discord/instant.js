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

    const { data, error } = useApi({
        method: "POST",
        path: "/api/v1/auth/instant/exchange",
        data: {
            code: code,
        },
        depends: [code],
    });

    if (error) {
        setTimeout(() => {
            router.push("/dashboard/account/platinum");
        }, 3000);

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
        w;
    }

    if (!data) {
        <>
            <HeadTag title="Desipher ― Login" />
            <Header />
            <div className="head">
                <div className="banner-textarea" data-aos="fade-down">
                    <div className="banner-title">
                        <span style={{ fontWeight: 500 }}>
                            Linking Your Account.
                        </span>
                    </div>
                    <div className="banner-slogan">
                        We are attempting to link your account.
                    </div>
                </div>
            </div>
        </>;
    }

    if (process.browser && data && data.code === 200) {
        setTimeout(() => {
            router.push("/dashboard/account/");
        }, 3000);

        return (
            <>
                <HeadTag title="Desipher ― Login" />
                <Header />
                <div className="head">
                    <div className="banner-textarea" data-aos="fade-down">
                        <div className="banner-title">
                            <span style={{ fontWeight: 500 }}>
                                Successfully Linked
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
                        <span style={{ fontWeight: 500 }}>
                            Linking Your Account.
                        </span>
                    </div>
                    <div className="banner-slogan">
                        We are attempting to link your account.
                    </div>
                </div>
            </div>
        </>
    );
}
