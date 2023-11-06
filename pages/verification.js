import { useEffect, useRef, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import HeadTag from "../components/HeadTag";
import useApi from "../hooks/api";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import Loading from "../components/Loading";
import axios from "axios";
import { LetoaDiscordAPIErrors } from "../lib/codes";
import {
    InvalidGuild,
    InvalidRole,
    MemberNotInServer,
    ProxyVpnDetected,
    SetupInvaild,
    UnknownError,
    UserNotLoggedIn,
} from "../components/VerificationError";
import { useRouter } from "next/router";

const {
    INVALID_GUILD,
    USER_NOT_LOGGED_IN,
    SETUP_NOT_VALID,
    MEMBER_NOT_IN_SERVER,
    VPN_PROXY_DETECTED,
    INVALID_ROLE_PROVIDED,
} = LetoaDiscordAPIErrors;

export async function getServerSideProps({ query }) {
    if (!query.state || !query.code) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    } else {
        return {
            props: {
                code: query.code,
                state: query.state,
            },
        };
    }
}

const InAppVerification = ({ code, state }) => {
    const router = useRouter();
    const captchaObject = useRef(null);
    const [success, setSuccess] = useState(false);
    const [errorCode, setErrorCode] = useState(null);
    const [errors, setError] = useState({
        message: null,
    });

    const { data, error } = useApi({
        method: "POST",
        path: "/api/v1/auth/exchange",
        data: {
            code: code,
            app: true,
        },
        depends: [code],
    });

    useEffect(() => {
        if (data) {
            window.localStorage.setItem("token", data.token);
        }
    }, [data]);

    if (error) {
        router.push("/");
        return <Loading />;
    }

    if (success) {
        return (
            <>
                <HeadTag title={"Desipher ― Verification"} />
                <Header />
                <div className="head">
                    <div className="banner-textarea">
                        <div className="banner-title">
                            <span style={{ fontWeight: 500 }}>SUCCESS</span>
                            <div className="banner-slogan-2">
                                You have successfully been verified. You may be
                                redirected shortly.
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (errorCode) {
        switch (errorCode) {
            case MEMBER_NOT_IN_SERVER:
                return <MemberNotInServer message={errors.message} />;
            case INVALID_GUILD:
                return <InvalidGuild />;
            case USER_NOT_LOGGED_IN:
                return <UserNotLoggedIn />;
            case INVALID_ROLE_PROVIDED:
                return <InvalidRole />;
            case SETUP_NOT_VALID:
                return <SetupInvaild />;
            case VPN_PROXY_DETECTED:
                return <ProxyVpnDetected />;
            default:
                console.log(errorCode);
                return (
                    <>
                        <HeadTag />
                        <Header />
                        <div className="head">
                            <div className="banner-textarea">
                                <div className="banner-title">
                                    <span style={{ fontWeight: 500 }}>
                                        UNKNOWN ERROR
                                    </span>
                                    <div className="banner-slogan-2">
                                        We have received an unexpected error.
                                        Please report this to server admins and
                                        try again later.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                );
        }
    }

    async function verify() {
        const guildId = state;

        try {
            const resp = await axios.post(
                `/api/v1/verification/${guildId}`,
                {},
                {
                    headers: {
                        Authorization: data.token,
                    },
                }
            );

            console.log(resp.data);

            if (resp.data.code !== 200) {
                setErrorCode(resp.data.code);
                setError(resp.data.message);
                return;
            } else {
                setError(resp.data.message);
                setSuccess(true);
            }
        } catch (e) {}
    }

    if (data && data.code === 200) {
        verify();

        return (
            <>
                <Loading />;
            </>
        );
    }

    return <Loading />;
};

export default InAppVerification;
