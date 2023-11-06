import { useQuery } from "react-query";
import { useRouter } from "next/router";
import { getUser } from "../../../api/users";
import { useToken } from "../../../context/token";
import { ThreeDots } from "react-loading-icons";
import DiscordError from "../../../errors/DiscordError";
import Side from "../../../components/AccountSide";
import HeadTag from "../../../components/HeadTag";
import Switch from "react-switch";
import Select from "react-select";
import { useState, useEffect } from "react";
import UnAuthorized from "../../../errors/UnAuthorized";
import Loading from "../../../components/Loading";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const PlatinumDashboard = () => {
    const colourStyles = {
        control: (styles) => ({
            ...styles,
            backgroundColor: "",
            border: 0,
            boxShadow: "none",
        }),
        menuList: (styles) => ({
            ...styles,
            backgroundColor: "#151f39",
        }),
        option: (styles) => {
            return {
                ...styles,
                backgroundColor: "#151f39",
                color: "#fff",
            };
        },
        placeholder: (style) => {
            return {
                ...style,
                color: "#fff",
            };
        },
        singleValue: (style) => {
            return {
                ...style,
                color: "#fff",
            };
        },
    };

    const router = useRouter();
    const { id } = router.query;
    const [token] = useToken();
    const [vpnCheck, setVpnCheck] = useState(false);
    const [customText, setCustomText] = useState(null);

    const { data, isLoading, isError, error } = useQuery(
        [
            "user",
            {
                Authorization: process.browser
                    ? window.localStorage.getItem("token")
                    : token,
            },
        ],
        getUser,
        {
            retry: false,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
        }
    );

    if (isLoading && process.browser) {
        return (
            <>
                <Loading />
            </>
        );
    }

    if (isError) {
        if (error instanceof DiscordError) {
            router.push("/link/discord");
            return <Loading />;
        } else if (error instanceof UnAuthorized) {
            router.push("/dashboard/account");
            return <Loading />;
        } else {
            router.push("/login");
            return <Loading />;
        }
    }

    if (data && data.premiumLevel !== 3) {
        router.push(`/dashboard/account`);
        return (
            <>
                <Loading />
            </>
        );
    }

    if (data && !isError && !isLoading) {
        return (
            <>
                <HeadTag title={`Desipher ― Platinum Settings`} />
                <Side
                    platinum={data.premiumLevel === 3}
                    customBots={data.allowedCustomBots}
                />
                <div className="dashboard-container">
                    <div className="page-title">
                        Platinum Settings - COMING SOON
                    </div>
                    <div className="section group">
                        <div className="col dashboard-span_1_of_2">
                            <div
                                className="box"
                                style={{ marginBottom: "20px" }}
                            >
                                <div className="box-title">PLATINUM</div>
                                <div className="divider" />
                                <div className="box-desc">
                                    Link Instant Server Restore
                                    <div style={{ height: "10px" }} />
                                    <div className="center">
                                        <div
                                            className="app-button"
                                            style={{ width: "75%" }}
                                            onClick={() => {
                                                // TODO: Handle save xo
                                                router.push(
                                                    "/api/v1/auth/discord/instant"
                                                );
                                            }}
                                        >
                                            LINK
                                        </div>
                                    </div>
                                </div>
                                <div className="divider" />
                                <div
                                    className="app-button"
                                    onClick={() => router.push("/discord")}
                                >
                                    NEED HELP?
                                </div>
                            </div>
                        </div>
                        <div className="col dashboard_span_2_of_2">
                            <div
                                className="box"
                                style={{ marginBottom: "20px" }}
                            >
                                <div className="box-title">Your Account</div>
                                <div
                                    className="account-settings-area"
                                    style={{ display: "flex" }}
                                >
                                    <div className="user-text">
                                        <div className="user-title">
                                            Account ID
                                        </div>
                                        <div className="user-desc">
                                            {data.accountID}
                                        </div>

                                        <div className="user-title">
                                            Username
                                        </div>
                                        <div className="user-desc">
                                            {data.username}
                                        </div>
                                        <div className="user-title">
                                            Instant Restore Discord Linked
                                        </div>
                                        <div className="user-desc">
                                            {data.platinum.linked
                                                ? data.platinum.linked
                                                : "Not Linked"}
                                        </div>
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
    }

    return <Loading />;
};

export default PlatinumDashboard;
