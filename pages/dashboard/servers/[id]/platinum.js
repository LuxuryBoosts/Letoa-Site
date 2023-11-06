import { useQuery } from "react-query";
import { useRouter } from "next/router";
import { getGuildInfo } from "../../../../api/guild";
import { useToken } from "../../../../context/token";
import { ThreeDots } from "react-loading-icons";
import DiscordError from "../../../../errors/DiscordError";
import Side from "../../../../components/Side";
import HeadTag from "../../../../components/HeadTag";
import Switch from "react-switch";
import Select from "react-select";
import { useState, useEffect } from "react";
import UnAuthorized from "../../../../errors/UnAuthorized";
import Loading from "../../../../components/Loading";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios, { Axios } from "axios";
import { LetoaDiscordAPIErrors } from "../../../../lib/codes";

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
    const [customText, setCustomText] = useState(null);
    const [customDomain, setCustomDomain] = useState(null);
    const [saving, setSaving] = useState(false);

    const { data, isLoading, isError, error } = useQuery(
        [
            "guild",
            {
                Authorization: process.browser
                    ? window.localStorage.getItem("token")
                    : token,
                GuildID: id,
            },
        ],
        getGuildInfo,
        {
            retry: false,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
        }
    );

    const handleSave = async () => {
        try {
            setSaving(true);
            const data = {
                customDomain,
            };

            const resp = await axios.post(
                `/api/v1/guilds/platinum/${id}`,
                data,
                {
                    headers: {
                        Authorization: process.browser
                            ? window.localStorage.getItem("token")
                            : token,
                        "Content-Type": "application/json",
                    },
                }
            );

            setSaving(false);

            switch (resp.data.code) {
                case 200:
                    toast.success("Settings have successfully been saved!", {
                        position: "bottom-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        theme: "dark",
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    break;
            }
        } catch (e) {
            toast.error("Failed to save settings!", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                theme: "dark",
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    useEffect(() => {
        if (data) {
            setCustomDomain(data.platinum.customDomain);
        }
    }, [data]);

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
            router.push("/dashboard/servers");
            return <Loading />;
        } else {
            router.push("/login");
            return <Loading />;
        }
    }

    if (data && data.premium.level !== 3) {
        router.push(`/dashboard/servers/${id}`);
        return (
            <>
                <Loading />
            </>
        );
    }

    if (data && !isError && !isLoading) {
        return (
            <>
                <HeadTag
                    title={`Desipher ― Platinum ${
                        data ? data.guild.name : null
                    }`}
                />
                <Side id={id} platinum={data.premium.level === 3} />
                <div className="dashboard-container">
                    <div className="page-title">Platinum Settings</div>
                    <div className="section group">
                        <div className="col dashboard-span_1_of_2">
                            <div
                                className="box"
                                style={{ marginBottom: "20px" }}
                            >
                                <div className="box-title">PLATINUM</div>
                                <div className="divider" />
                                <div className="box-desc">
                                    Custom Verification Text
                                    <div style={{ height: "10px" }} />
                                    <span
                                        style={{
                                            marginTop: "-4px",
                                            clear: "both",
                                        }}
                                    >
                                        <input
                                            disabled
                                            className="input"
                                            type="text"
                                            placeholder="By verifiying, you agree to our Terms Of Service and that the owner can add you to the new server if it gets deleted."
                                            value={customText}
                                            onChange={(e) =>
                                                setCustomText(e.target.value)
                                            }
                                        />
                                    </span>
                                </div>
                                <div style={{ height: "10px" }} />
                                <div className="box-desc">
                                    Custom Domain
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
                                            placeholder="domain.com"
                                            value={customDomain}
                                            onChange={(e) =>
                                                setCustomDomain(e.target.value)
                                            }
                                        />
                                    </span>
                                </div>
                                <div style={{ height: "10px" }} />
                                <div className="box-desc">
                                    Custom CSS
                                    <div style={{ height: "10px" }} />
                                    <span
                                        style={{
                                            marginTop: "-4px",
                                            clear: "both",
                                        }}
                                    >
                                        <textarea
                                            className="input"
                                            placeholder="Custom CSS Here."
                                            disabled
                                        />
                                    </span>
                                </div>
                                <div style={{ height: "10px" }} />
                                <div className="box-desc">
                                    Instant Server Restore
                                    <div style={{ height: "10px" }} />
                                    <span
                                        style={{
                                            marginTop: "-4px",
                                            clear: "both",
                                        }}
                                    >
                                        <div className="center">
                                            <button
                                                style={{ width: "50%" }}
                                                className="app-button"
                                                disabled
                                            >
                                                Restore
                                            </button>
                                        </div>
                                    </span>
                                </div>
                                <div style={{ height: "10px" }} />
                                <div className="divider" />
                                <button
                                    className="app-button"
                                    onClick={() => {
                                        // TODO: Handle save xo
                                        handleSave();
                                    }}
                                    disabled={saving}
                                >
                                    SAVE SETTINGS
                                </button>
                                <div style={{ height: "10px" }} />
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
                                <div className="box-title">FAQ</div>
                                <div
                                    className="account-settings-area"
                                    style={{ display: "flex" }}
                                >
                                    <div className="user-text">
                                        <div className="user-title">
                                            What is the Platinum Panel?
                                        </div>
                                        <div className="user-desc">
                                            The Platinum Panel is a separate
                                            dashboard for enterprise users. Here
                                            you can configure advanced settings.
                                        </div>
                                        <div className="user-title">
                                            What is the Custom Domain?
                                        </div>
                                        <div className="user-desc">
                                            The custom domain allows you to make
                                            your verification available on a
                                            separate domain. Instead of it being
                                            https://desipher.io/verify/desipher,
                                            it would be https://domain.com.
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
