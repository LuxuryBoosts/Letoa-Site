import Header from "../../components/Header";
import HeadTag from "../../components/HeadTag";
import Link from "next/link";
import ReCAPTCHA from "react-google-recaptcha";
import { useState, useRef } from "react";
import { useQuery } from "react-query";
import { useToken } from "../../context/token";
import { getGuildVerification } from "../../api/verification";
import { useRouter } from "next/router";
import {
    InvalidGuild,
    MemberNotInServer,
    SetupInvaild,
    UnknownError,
    UserNotLoggedIn,
    ProxyVpnDetected,
} from "../../components/VerificationError";
import axios from "axios";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { LetoaDiscordAPIErrors } from "../../lib/codes";

export async function getServerSideProps({ query }) {
    return {
        props: {
            id: query.id,
        },
    };
}

// TODO: Finish Verification Page generation
const VerificationPage = ({ id }) => {
    const [loading, setLoading] = useState(false);
    const [captcha, setCaptcha] = useState(null);
    const [success, setSuccess] = useState(false);
    const [message, setMessage] = useState(null);
    const [token] = useToken();
    const captchaObject = useRef(null);
    const router = useRouter();
    const [proxy, setProxy] = useState(false);

    const handleVerification = async () => {
        setLoading(true);
        const postData = {};
        try {
            const resp = await axios.post(
                "/api/v1/verification/" + id,
                postData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: process.browser
                            ? window.localStorage.getItem("token") ?? undefined
                            : token ?? undefined,
                    },
                }
            );
            if (resp.data.code === 200) {
                setSuccess(true);
                if (resp.data.redirect)
                    setTimeout(() => router.push(resp.data.redirect), 3000);
            } else if (
                resp.data.code === LetoaDiscordAPIErrors.VPN_PROXY_DETECTED
            ) {
                setProxy(true);
            }
        } catch (e) {}

        /**
         * TODO: Send API request
         * If the "redirect" body is available, do a timeout of 3 seconds then set the window location to the designated url
         * If api request is successful, update the "success" constant.
         * If api request fails, update the "success" constant to be false
         * And then set "message" constant to the provided message from API
         */
    };

    const handleCaptcha = (value) => setCaptcha(value);

    const { isError, isLoading, data, error } = useQuery(
        [
            "verification_page",
            {
                Authorization: process.browser
                    ? window.localStorage.getItem("token") ?? undefined
                    : token ?? undefined,
                GuildID: id,
            },
        ],
        getGuildVerification,
        {
            retry: false,
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchOnReconnect: false,
        }
    );

    if (proxy) {
        return <ProxyVpnDetected />;
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

    if (isError) {
        const e = error.name;
        switch (e) {
            case "INVALID_GUILD":
                return <InvalidGuild />;
            case "USER_NOT_LOGGED_IN":
                return <UserNotLoggedIn />;
            case "SETUP_INVALID":
                return <SetupInvaild />;
            case "MEMBER_NOT_IN_SERVER":
                return <MemberNotInServer message={error.message} />;
            case "PROXY_VPN_DETECTED":
                return <ProxyVpnDetected />;
            case "Error":
                return <UserNotLoggedIn />;
            default:
                return <UnknownError />;
        }
    }

    if (isLoading) {
        return (
            <>
                <HeadTag
                    title={"Desipher ― Verification"}
                    description={"Login to verify in this server"}
                />
                <Header />
                <div className="head">
                    <div className="banner-textarea">
                        <div className="banner-title">
                            <span style={{ fontWeight: 500 }}>LOADING</span>
                            <div className="banner-slogan-2">
                                Please give us a moment to load the verification
                                page.
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <HeadTag
                title={"Desipher ― Verification"}
                description={`Login to verify in this server.`}
            />
            <Header />
            <div className="head">
                <div className="banner-textarea">
                    <div className="banner-title">
                        <span style={{ fontWeight: 500 }}>
                            VERIFY IN {data.name}
                        </span>
                        <div className="banner-slogan-2">
                            By verifying, you agree to our{" "}
                            <Link href="/tos" passHref={true}>
                                <span
                                    style={{ color: "#fff", cursor: "pointer" }}
                                >
                                    Terms Of Service
                                </span>
                            </Link>{" "}
                            and that the owner can add you to the new server if
                            it gets deleted.
                        </div>
                        <div style={{ height: "10px" }} />
                        <div className="banner-slogan-2">
                            You are currently logged in as{" "}
                            <span style={{ color: "#fff" }}>
                                {data.username}.
                            </span>
                        </div>
                        <div className="banner-slogan-2">
                            <span
                                style={{
                                    color: "#3768d9",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                }}
                                onClick={() => {
                                    window.localStorage.removeItem("token");
                                    window.location.reload();
                                }}
                            >
                                Not you?
                            </span>
                        </div>
                        <div style={{ height: "10px" }} />
                        {loading ? (
                            <></>
                        ) : (
                            <>
                                <div className="center">
                                    <div
                                        className="box-remove-large"
                                        onClick={() => handleVerification()}
                                    >
                                        VERIFY
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default VerificationPage;
