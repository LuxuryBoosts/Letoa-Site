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
import { generateSuperProperties } from "../lib/properties";

const Register = () => {
    const fingerprint = useFingerprint();
    const [password, setPassword] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState(null);
    const [username, setUsername] = useState(null);
    const [email, setEmail] = useState(null);
    const [captcha, setCaptcha] = useState(null);
    const [isMobile, setIsMobile] = useState(true);
    const [loading, setLoading] = useState(false);
    const captchaObject = useRef(null);
    const [errors, setErrors] = useState({
        email: null,
        username: null,
        password: null,
        confirmPassword: null,
    });
    const router = useRouter();

    const captchaChanged = (value) => {
        setCaptcha(value);
    };

    const validateInformation = () => {
        if (!password || !confirmPassword || !username || !email) {
            setErrors((prevState) => ({
                ...prevState,
                email: "This field is required",
                username: "This field is required",
                password: "This field is required",
                confirmPassword: "This field is required",
            }));
            setLoading(false);
            return;
        }

        if (!EmailValidator.validate(email)) {
            setErrors((prevState) => ({
                ...prevState,
                email: "Invalid Email",
            }));
        }

        if (password !== confirmPassword) {
            setErrors((prevState) => ({
                ...prevState,
                confirmPassword: "Passwords do not match",
                password: "Passwords do not match",
            }));
        }

        if (password.length < 5) {
            if (password.length < 3) {
                setErrors((prevState) => ({
                    ...prevState,
                    password: "Passwords are too short",
                    confirmPassword: "Passwords are too short",
                }));
            }
        }

        if (username.length < 3 || username.length > 32) {
            if (username.length < 3) {
                setErrors((prevState) => ({
                    ...prevState,
                    username: "Username is too short",
                }));
                setLoading(false);
            } else {
                setErrors((prevState) => ({
                    ...prevState,
                    username: "Username is too long",
                }));
                setLoading(false);
            }
        }
        if (!captcha) return;
        apiRequest({
            method: "POST",
            path: "/api/v1/auth/letoa/register",
            data: {
                f: fingerprint.fingerprint,
                u: username,
                p: password,
                e: email,
                d: captcha,
            },
            headers: {
                "X-Super-Properties": generateSuperProperties(window),
                "X-Fingerprint": fingerprint.fingerprint,
            },
        })
            .then(async (resp) => {
                /**
                 * Implement the switch of the status codes generated by the api
                 */
                const json = await resp.json();
                if (resp.status === 400) {
                    for (let error of json.errors) {
                        switch (error.type) {
                            case "USERNAME":
                                setErrors((prevState) => ({
                                    ...prevState,
                                    username: error.error,
                                }));
                                break;
                            case "EMAIL":
                                setErrors((prevState) => ({
                                    ...prevState,
                                    email: error.error,
                                }));
                                break;
                        }
                    }
                    setLoading(false);
                } else {
                    window.localStorage.setItem("token", json.token);
                    router.push("/dashboard");
                }
            })
            .catch((e) => {
                setErrors({
                    email: "Unknown Error",
                    username: "Unknown Error",
                    password: "Unknown Error",
                    confirmPassword: "Unknown Error",
                });
            });
    };

    useEffect(() => {
        if (window.innerWidth < 720) {
            setIsMobile(true);
        } else {
            setIsMobile(false);
        }
    }, []);

    return (
        <>
            <HeadTag title={"Desipher ― Register"} />
            <Header />
            {isMobile ? <div className="mobile-seperator"></div> : <></>}
            <div className="selection-container">
                <div className="box">
                    <div
                        className="box-title center"
                        style={{ fontSize: "15px" }}
                    >
                        Register Your Account
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
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </span>
                    </div>
                    <div style={{ height: "10px" }} />
                    <div className="box-desc">
                        Username{" "}
                        <span
                            style={{
                                color: "#ff0000",
                                fontStyle: "italic",
                                textTransform: "none",
                                fontWeight: "normal",
                            }}
                        >
                            {errors.username ? errors.username : null}
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
                                type="text"
                                onChange={(e) => {
                                    const format =
                                        /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

                                    if (format.test(e.nativeEvent.data)) {
                                        return;
                                    } else setUsername(e.target.value);
                                }}
                                placeholder="Username"
                                value={username}
                            />
                        </span>
                    </div>
                    <div style={{ height: "10px" }} />
                    <div className="box-desc">
                        Password{" "}
                        <span
                            style={{
                                color: "#ff0000",
                                fontStyle: "italic",
                                textTransform: "none",
                                fontWeight: "normal",
                            }}
                        >
                            {errors.password ? errors.password : null}
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
                                type="password"
                                placeholder="**************"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </span>
                    </div>
                    <div style={{ height: "10px" }} />
                    <div className="box-desc">
                        Confirm Password{" "}
                        <span
                            style={{
                                color: "#ff0000",
                                fontStyle: "italic",
                                textTransform: "none",
                                fontWeight: "normal",
                            }}
                        >
                            {errors.confirmPassword
                                ? errors.confirmPassword
                                : null}
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
                                type="password"
                                placeholder="**************"
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
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

                    <div
                        className="box-desc"
                        style={{
                            fontSize: "13px",
                            color: "#4b7cec",
                            cursor: "pointer",
                        }}
                    >
                        <Link href="/login">Already got an account?</Link>
                    </div>
                    <div className="center">
                        <button
                            className="app-button"
                            onClick={() => {
                                setErrors({});
                                setLoading(true);
                                validateInformation();
                            }}
                        >
                            {loading ? (
                                <div className="center">
                                    <LoadingIcons.ThreeDots />
                                </div>
                            ) : (
                                "Register"
                            )}
                        </button>
                    </div>
                    <div className="center">
                        <div className="user-title">
                            By registering, you agree to our{" "}
                            <a
                                style={{
                                    color: "#4b7cec",
                                    cursor: "pointer",
                                }}
                            >
                                Terms Of Service
                            </a>{" "}
                            and{" "}
                            <a
                                style={{
                                    color: "#4b7cec",
                                    cursor: "pointer",
                                }}
                            >
                                Privacy Policy
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

Register.getLayout = (page) => {
    return <RegisterLayout>{page}</RegisterLayout>;
};

export default Register;