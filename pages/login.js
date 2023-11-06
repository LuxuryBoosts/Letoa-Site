import { useEffect, useState, useRef } from "react";
import Header from "../components/Header";
import HeadTag from "../components/HeadTag";
import ReCaptcha from "react-google-recaptcha";
import Link from "next/link";
import RegisterLayout from "../layouts/register";
import LoadingIcons from "react-loading-icons";
import apiRequest from "../api";
import { useFingerprint } from "../context/fingerprint";
import { useRouter } from "next/router";
import { useToken } from "../context/token";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { generateSuperProperties } from "../lib/properties";

const Login = () => {
    const fingerprint = useFingerprint();
    const [isMobile, setIsMobile] = useState(true);
    const [username, setUsername] = useState(null);
    const [captcha, setCaptcha] = useState(null);
    const [password, setPassword] = useState(null);
    const [loading, setLoading] = useState(false);
    const captchaObject = useRef(null);
    const [token, setToken] = useToken();

    const [errors, setErrors] = useState({
        email: null,
        username: null,
        password: null,
    });
    const router = useRouter();

    useEffect(() => {
        if (window.innerWidth < 720) {
            setIsMobile(true);
        } else {
            setIsMobile(false);
        }
    }, []);

    const resetPassword = () => {};

    const send = () => {
        if (!username || !password) {
            setLoading(false);
            setErrors({
                username: username ? null : "This field is required",
                password: password ? null : "This field is required",
            });
        }
        if (!captcha) {
            setLoading(false);
            return;
        }
        apiRequest({
            method: "POST",
            path: "/api/v1/auth/letoa/login",
            data: {
                u: username,
                p: password,
                d: captcha,
                f: fingerprint.fingerprint,
            },
            headers: {
                "X-Super-Properties": generateSuperProperties(window),
            },
        })
            .then(async (resp) => {
                const data = await resp.json();
                if (resp.status === 400) {
                    switch (data.type) {
                        case "INVALID_LOGIN":
                            setErrors({
                                username: "Login or password is invalid",
                                password: "Login or password is invalid",
                            });
                            break;
                    }
                    setLoading(false);
                } else {
                    setToken(data.token);
                    return router.push("/dashboard");
                }
            })
            .catch((e) => {
                console.log(e);
                setLoading(false);
                setErrors((prevState) => ({
                    ...prevState,
                    username: "Unknown Error",
                    password: "Unknown Error",
                }));
            });
    };

    return (
        <>
            <HeadTag title={"Desipher ― Login"} />
            <Header />
            {isMobile ? <div className="mobile-seperator"></div> : <></>}
            <div className="selection-container">
                <div className="box">
                    <div
                        className="box-title center"
                        style={{ fontSize: "15px" }}
                    >
                        Login To Your Account
                    </div>
                    <div className="divider" />
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
                                value={username}
                                placeholder="Username"
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
                        onClick={() => router.push("/forgot")}
                    >
                        Forgot your password
                    </div>
                    <div style={{ height: "10px" }} />
                    <div
                        className="box-desc"
                        style={{
                            fontSize: "13px",
                            color: "#4b7cec",
                            cursor: "pointer",
                        }}
                        onClick={() => router.push("/register")}
                    >
                        Don&apos;t have an account?
                    </div>
                    <div className="center">
                        <button
                            className="app-button"
                            onClick={() => {
                                setErrors({});
                                setLoading(true);
                                send();
                            }}
                        >
                            {loading ? (
                                <div className="center">
                                    <LoadingIcons.ThreeDots />
                                </div>
                            ) : (
                                "Login"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

Login.getLayout = (page) => {
    return <RegisterLayout>{page}</RegisterLayout>;
};

export default Login;
