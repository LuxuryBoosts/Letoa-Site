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
import { useRouter } from "next/router";
import HCaptcha from "@hcaptcha/react-hcaptcha";

const ForgotPassword = () => {
    const [email, setEmail] = useState(null);
    const [hide, setHide] = useState(false);
    const [captcha, setCaptcha] = useState(null);
    const [loading, setLoading] = useState(false);
    const captchaObject = useRef(null);
    const [errors, setError] = useState({
        email: null,
    });

    const sendRequest = () => {
        if (!email || !captcha) {
            setError((prevState) => ({
                ...prevState,
                email: email ? null : "This field is required.",
            }));
            return;
        }
        if (!EmailValidator.validate(email)) {
            setError((prev) => ({
                ...prev,
                email: "Invalid Email Format",
            }));
            return;
        }

        apiRequest({
            method: "POST",
            path: "/api/v1/auth/letoa/forgot",
            data: {
                e: email,
                c: captcha,
            },
        })
            .then(async (resp) => {
                const res = await resp.json();
                if (resp.status !== 200) {
                    setError((prevState) => ({
                        ...prevState,
                        email: res.error,
                    }));
                    setLoading(false);
                    return;
                }
                setHide(true);
            })
            .catch((e) => {
                console.log(e);
                setLoading(false);
                return;
            });
    };
    return (
        <>
            <HeadTag
                title={"Desipher ― Reset Password"}
                description={"Forgot your password recovery"}
            />
            <Header />
            <div className="selection-container">
                <div className="box" hidden={!hide}>
                    <div
                        className="box-title center"
                        style={{ fontSize: "15px" }}
                    >
                        Reset Your Password
                    </div>
                    <div className="divider" />
                    <div className="box-desc center">
                        We have sent an email to the email you provided. If an
                        existing account is found, you will be able to reset
                        your password.
                    </div>
                </div>
                <div className="box" hidden={hide}>
                    <div
                        className="box-title center"
                        style={{ fontSize: "15px" }}
                    >
                        Reset Your Password
                    </div>
                    <div className="divider" />
                    <div className="box-desc">
                        Email{" "}
                        <span
                            style={{
                                color: "#ff0000",
                                fontStyle: "italic",
                                textTransform: "none",
                                fontWeight: "normal",
                            }}
                        >
                            {errors.email ? errors.email : null}
                        </span>
                        <div style={{ height: "10px" }} />
                        <span
                            style={{
                                marginTop: "-4px",
                                clear: "both",
                            }}
                        >
                            <input
                                className="input"
                                type="email"
                                placeholder="example@example.com"
                                onReset={() => {
                                    setEmail(null);
                                }}
                                onChange={(e) => {
                                    setEmail(e.target.value);
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
                                setError({});
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

export default ForgotPassword;
