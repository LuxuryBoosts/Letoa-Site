import { useEffect, useState, useRef } from "react";
import Header from "../components/Header";
import HeadTag from "../components/HeadTag";
import ReCaptcha from "react-google-recaptcha";
import Link from "next/link";
import * as EmailValidator from "email-validator";
import RegisterLayout from "../layouts/register";
import { useFingerprint } from "../context/fingerprint";
import useApi from "../hooks/api";
import apiRequest from "../api";
import LoadingIcons from "react-loading-icons";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { useRouter } from "next/router";

export async function getServerSideProps({ query }) {
    if (!query.token) {
        return {
            redirect: {
                destination: "/forgot",
                permanent: false,
            },
        };
    } else {
        return {
            props: {
                token: query.token,
            },
        };
    }
}

const Reset = ({ token }) => {
    const [password, setPassword] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hide, setHide] = useState(false);
    const [message, setMessage] = useState(null);
    const captchaObject = useRef(null);
    const [captcha, setCaptcha] = useState(null);

    const router = useRouter();

    const sendRequest = () => {
        if (!password && !captcha) {
            return;
        }

        apiRequest({
            method: "POST",
            path: "/api/v1/auth/letoa/reset",
            data: {
                p: password,
                c: captcha,
                t: token,
            },
        })
            .then(async (resp) => {
                const res = await resp.json();
                if (resp.status !== 200) {
                    setHide(true);
                    setMessage(res.message);
                    return;
                }
                window.localStorage.setItem("token", res.token);
                router.push("/dashboard/account");
                return;
            })
            .catch((e) => {
                console.log(e);
                router.push("/");
                return;
            });
    };

    return (
        <>
            <HeadTag title={"Desipher ― Reset Password"} />
            <Header />
            <div className="selection-container">
                <div className="box" hidden={hide}>
                    <div
                        className="box-title center"
                        style={{ fontSize: "15px" }}
                    >
                        Reset Your Password
                    </div>
                    <div className="divider" />
                    <div className="box-desc">
                        New Password
                        <div style={{ height: "10px" }} />
                        <span
                            style={{
                                marginTop: "-4px",
                                clear: "both",
                            }}
                        >
                            <input
                                className="input"
                                type="password"
                                placeholder="********"
                                minLength={3}
                                onReset={() => {
                                    setPassword(null);
                                }}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                }}
                            />
                        </span>
                    </div>
                    <div style={{ height: "10px" }} />
                    <div className="center">
                        <HCaptcha
                            sitekey={process.env.NEXT_PUBLIC_SITE_KEY}
                            onVerify={async (token) => setCaptcha(token)}
                            ref={captchaObject}
                        />
                    </div>
                    <div style={{ height: "10px" }} />
                    <div className="center">
                        <button
                            className="app-button"
                            onClick={() => {
                                setLoading(true);
                                sendRequest();
                            }}
                        >
                            {loading ? (
                                <div className="center">
                                    <LoadingIcons.ThreeDots />
                                </div>
                            ) : (
                                "Reset Your Password"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Reset;
