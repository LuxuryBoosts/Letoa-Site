import Header from "../../../components/Header";
import HeadTag from "../../../components/HeadTag";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useToken } from "../../../context/token";
import { getUser } from "../../../api/users";
import { ThreeDots } from "react-loading-icons";
import DiscordError from "../../../errors/DiscordError";
import apiRequest from "../../../api";
import { useRouter } from "next/router";
import Side from "../../../components/Side";
import AccountSide from "../../../components/AccountSide";
import Loading from "../../../components/Loading";
import DashboardFooter from "../../../components/DashboardFooter";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DashboardAccount = () => {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(true);
    const [token] = useToken();
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [new_password, setNewPassword] = useState(null);
    const [loading, setLoading] = useState(false);
    const { isError, isLoading, data, error } = useQuery(
        [
            "user",
            {
                Authorization: process.browser
                    ? window.localStorage.getItem("token")
                    : token,
            },
        ],
        getUser,
        { retry: false }
    );

    useEffect(() => {
        if (window.innerWidth < 720) {
            setIsMobile(true);
        } else {
            setIsMobile(false);
        }
    }, []);

    useEffect(() => {
        setEmail(data ? data.email : null);
    }, [data]);

    if (loading) {
        <>
            <Loading />
        </>;
    }

    const updateAccountInformation = () => {
        apiRequest({
            method: "POST",
            path: "/api/v1/auth/letoa/update",
            data: {
                e: email,
                p: password,
                np: new_password ? new_password : undefined,
            },
            token: process.browser
                ? window.localStorage.getItem("token")
                : token,
        })
            .then(async (resp) => {
                const data = await resp.json();
                if (resp.status === 200) {
                    toast.success("Successfully updated account settings.", {
                        position: "bottom-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        theme: "dark",
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    setTimeout(() => {
                        if (process.browser) window.location.reload();
                    }, 5000);
                    return;
                } else {
                    if (data.errors) {
                        data.errors.map((v) => {
                            toast.error(v.error, {
                                position: "bottom-right",
                                autoClose: 5000,
                                hideProgressBar: false,
                                theme: "dark",
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                            });
                        });
                        return;
                    } else {
                        toast.error(data.message, {
                            position: "bottom-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            theme: "dark",
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                        return;
                    }
                }
            })
            .catch((e) => {
                toast.error(
                    "An unknown error has occurred. Please contact support.",
                    {
                        position: "bottom-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        theme: "dark",
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    }
                );
                return;
            });
    };

    const unlinkDiscord = () => {
        apiRequest({
            method: "POST",
            path: "/api/v1/auth/letoa/unlink",
            data: {},
            token: process.browser
                ? window.localStorage.getItem("token")
                : token,
        })
            .then((res) => {
                if (res.status === 200) {
                    window.location.reload();
                }
            })
            .catch((e) => {
                console.trace(e);
            });
    };

    const getPremiumTier = (level) => {
        switch (level) {
            case 0:
                return "None";
            case 1:
                return "Gold Tier";
            case 2:
                return "Diamond Tier";
            case 3:
                return "Platinum Tier";
            default:
                return "Hmm...";
        }
    };

    if (isLoading) {
        return <Loading />;
    }

    if (isError) {
        if (error instanceof DiscordError) {
            router.push("/link/discord");

            return <Loading />;
        } else {
            router.push("/login");

            return <Loading />;
        }
    }

    if (data && !data.username) {
        router.push("/login");
    }

    return (
        <>
            <HeadTag title={"Desipher - Account"} />
            <AccountSide
                platinum={data.premiumLevel === 3}
                admin={data.admin}
                customBots={data.allowedCustomBots}
            />
            <div className="dashboard-container">
                {isMobile ? <div style={{ height: "15px" }}></div> : <></>}
                <div className="page-title">Account Settings</div>
                <div
                    className="section group"
                    data-aos="zoom-in"
                    style={{ marginBottom: "40px" }}
                >
                    <div className="col dashboard-span_1_of_2">
                        <div className="box" style={{ marginBottom: "20px" }}>
                            <div className="box-title">Update Account</div>
                            <div className="settings-input-label">
                                Email{" "}
                                <span style={{ color: "#eb3349" }}>*</span>
                                <input
                                    onChange={(e) => setEmail(e.target.value)}
                                    type="text"
                                    className="settings-input"
                                    value={email}
                                />
                            </div>
                            <div className="settings-input-inline">
                                <div
                                    className="settings-input-area"
                                    style={{
                                        width: "50%",
                                        marginRight: "10px",
                                    }}
                                >
                                    <div className="settings-input-label">
                                        Password{" "}
                                        <span style={{ color: "#eb3349" }}>
                                            *
                                        </span>
                                        <input
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                            type="password"
                                            className="settings-input"
                                            placeholder="Current Password"
                                            value={password}
                                        />
                                    </div>
                                </div>
                                <div
                                    className="settings-input-area"
                                    style={{
                                        width: "50%",
                                    }}
                                >
                                    <div className="settings-input-label">
                                        New Password{" "}
                                        <input
                                            type="password"
                                            onChange={(e) =>
                                                setNewPassword(e.target.value)
                                            }
                                            className="settings-input"
                                            placeholder="New Password"
                                            value={new_password}
                                        />
                                    </div>
                                </div>
                            </div>
                            <button
                                name="updateAccount"
                                className="settings-button"
                                onClick={() => updateAccountInformation()}
                            >
                                Update
                            </button>
                        </div>
                    </div>
                    <div className="col dashboard_span_2_of_2">
                        <div className="box" style={{ marginBottom: "20px" }}>
                            <div className="box-title">Your Account</div>
                            <div
                                className="account-settings-area"
                                style={{ display: "flex" }}
                            >
                                <div className="user-text">
                                    <div className="user-title">Account ID</div>
                                    <div className="user-desc">
                                        {data.accountID}
                                    </div>

                                    <div className="user-title">Username</div>
                                    <div className="user-desc">
                                        {data.username}
                                    </div>

                                    <div className="user-title">Premium</div>
                                    <div className="user-desc">
                                        {data.premiumLevel !== 0
                                            ? `True: ${
                                                  data.premiumExpire ===
                                                  16727954400000
                                                      ? "Lifetime"
                                                      : `Expires ${new Date(
                                                            data.premiumExpire
                                                        ).toLocaleString()}`
                                              } `
                                            : "False"}
                                    </div>

                                    <div className="user-title">
                                        Premium Level
                                    </div>
                                    <div className="user-desc">
                                        {getPremiumTier(data.premiumLevel)}
                                    </div>

                                    <div className="user-title">
                                        Discord Linked
                                    </div>
                                    <div className="user-desc">
                                        {data.discordTag} - {data.discordId}
                                    </div>
                                    <button
                                        type="submit"
                                        name="updateAccount"
                                        className="settings-button"
                                        onClick={() => {
                                            unlinkDiscord();
                                        }}
                                    >
                                        Unlink Discord
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </>
    );
};

export default DashboardAccount;
