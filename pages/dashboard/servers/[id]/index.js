import { useQuery } from "react-query";
import { useRouter } from "next/router";
import { getGuildInfo } from "../../../../api/guild";
import { useToken } from "../../../../context/token";
import { ThreeDots } from "react-loading-icons";
import DiscordError from "../../../../errors/DiscordError";
import Side from "../../../../components/Side";
import HeadTag from "../../../../components/HeadTag";
import UnAuthorized from "../../../../errors/UnAuthorized";
import BotNotAdded from "../../../../errors/BotNotAdded";
import { generateGuildAdd } from "../../../../lib/oauth2";
import { returnError } from "../../../../lib/error_handler";
import Loading from "../../../../components/Loading";
import Image from "next/image";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { LetoaDiscordAPIErrors } from "../../../../lib/codes";

const ServerManagement = () => {
    const router = useRouter();
    const { id } = router.query;
    const [token] = useToken();
    const [loading, setLoading] = useState(false);

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

    function decToHex(dec) {
        return (dec + Math.pow(16, 6)).toString(16).substr(-6);
    }

    if (isLoading && process.browser) {
        return (
            <>
                <Loading />
            </>
        );
    }

    if (isError) {
        /**
         * We use this as we want to make the code cleaner
         * and more easier to read.
         * And also to make changes easier across all files rather
         * than having "if" "else if" statements.
         */
        const errorReceived = returnError(error);
        switch (errorReceived) {
            case "DISCORD_ERROR":
                router.push("/link/discord");
                return <Loading />;
            case "UNAUTHORIZED":
                router.push("/dashboard/servers");
                return <Loading />;
            case "BOT_NOT_ADDED":
                router.push(generateGuildAdd(id));
                return <Loading />;
        }
    }

    if (data && !isError && !isLoading) {
        return (
            <>
                <HeadTag
                    title={`Desipher - Manage ${data ? data.guild.name : null}`}
                />
                <Side id={id} platinum={data.premium.level === 3} />
                <div className="dashboard-container">
                    {data.linked !== true ? (
                        <>
                            <div className="box">
                                <div className="box-title">Link Guild</div>
                                <div className="user-desc">
                                    Link this guild to your{" "}
                                    <strong>Desipher Account</strong> to gain
                                    the ability to restore it and create
                                    backups.
                                </div>
                                <div className="center">
                                    <button
                                        className="app-button"
                                        disabled={loading}
                                        onClick={async () => {
                                            setLoading(true);
                                            try {
                                                const resp = await axios.post(
                                                    `/api/v1/guilds/link`,
                                                    {
                                                        id,
                                                    },
                                                    {
                                                        headers: {
                                                            "Content-Type":
                                                                "application/json",
                                                            Authorization:
                                                                process.browser
                                                                    ? window.localStorage.getItem(
                                                                          "token"
                                                                      )
                                                                    : token,
                                                        },
                                                    }
                                                );
                                                toast.success(
                                                    resp.data.message,
                                                    {
                                                        autoClose: 5000,
                                                        hideProgressBar: false,
                                                        theme: "dark",
                                                        closeOnClick: true,
                                                        pauseOnHover: true,
                                                        draggable: true,
                                                        progress: undefined,
                                                    }
                                                );
                                                setLoading(false);
                                            } catch ({ response }) {
                                                setLoading(false);
                                                toast.error(
                                                    response.data.message,
                                                    {
                                                        autoClose: 5000,
                                                        hideProgressBar: false,
                                                        theme: "dark",
                                                        closeOnClick: true,
                                                        pauseOnHover: true,
                                                        draggable: true,
                                                        progress: undefined,
                                                    }
                                                );
                                            }
                                        }}
                                    >
                                        LINK
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <></>
                    )}
                    {data.premium.activated !== true &&
                    data.premium.level >= 1 ? (
                        <>
                            <div className="box">
                                <div className="box-title">
                                    Activate Premium
                                </div>
                                <div className="user-desc">
                                    Activate this server as premium so you can
                                    gain access to multiple unqiue features?
                                    Click the button below to activate premium.
                                </div>
                                <div className="center">
                                    <button
                                        className="app-button"
                                        disabled={loading}
                                        onClick={async () => {
                                            setLoading(true);
                                            try {
                                                const resp = await axios.post(
                                                    `/api/v1/guilds/premium/${id}/activate`,
                                                    {},
                                                    {
                                                        headers: {
                                                            "Content-Type":
                                                                "application/json",
                                                            Authorization:
                                                                process.browser
                                                                    ? window.localStorage.getItem(
                                                                          "token"
                                                                      )
                                                                    : token,
                                                        },
                                                    }
                                                );
                                                switch (resp.data.code) {
                                                    case 200:
                                                        toast.success(
                                                            resp.data.message,
                                                            {
                                                                autoClose: 5000,
                                                                hideProgressBar: false,
                                                                theme: "dark",
                                                                closeOnClick: true,
                                                                pauseOnHover: true,
                                                                draggable: true,
                                                                progress:
                                                                    undefined,
                                                            }
                                                        );
                                                        break;
                                                    case LetoaDiscordAPIErrors.PREMIUM_ALREADY_ACTIVATED:
                                                        toast.warn(
                                                            resp.data.message,
                                                            {
                                                                autoClose: 5000,
                                                                hideProgressBar: false,
                                                                theme: "dark",
                                                                closeOnClick: true,
                                                                pauseOnHover: true,
                                                                draggable: true,
                                                                progress:
                                                                    undefined,
                                                            }
                                                        );
                                                        break;
                                                    case LetoaDiscordAPIErrors.INVALID_ACCESS_TO_ACTIVATE:
                                                        toast.warn(
                                                            resp.data.message,
                                                            {
                                                                autoClose: 5000,
                                                                hideProgressBar: false,
                                                                theme: "dark",
                                                                closeOnClick: true,
                                                                pauseOnHover: true,
                                                                draggable: true,
                                                                progress:
                                                                    undefined,
                                                            }
                                                        );
                                                        break;
                                                    case LetoaDiscordAPIErrors.INVALID_PREMIUM_LEVEL:
                                                        toast.warn(
                                                            resp.data.message,
                                                            {
                                                                autoClose: 5000,
                                                                hideProgressBar: false,
                                                                theme: "dark",
                                                                closeOnClick: true,
                                                                pauseOnHover: true,
                                                                draggable: true,
                                                                progress:
                                                                    undefined,
                                                            }
                                                        );
                                                        break;
                                                    default:
                                                        toast.warn(
                                                            resp.data.message,
                                                            {
                                                                autoClose: 5000,
                                                                hideProgressBar: false,
                                                                theme: "dark",
                                                                closeOnClick: true,
                                                                pauseOnHover: true,
                                                                draggable: true,
                                                                progress:
                                                                    undefined,
                                                            }
                                                        );
                                                        break;
                                                }

                                                setLoading(false);
                                                setTimeout(() => {
                                                    window.location.reload();
                                                }, 3000);
                                            } catch ({ response }) {
                                                setLoading(false);
                                                toast.error("Unknown Error", {
                                                    autoClose: 5000,
                                                    hideProgressBar: false,
                                                    theme: "dark",
                                                    closeOnClick: true,
                                                    pauseOnHover: true,
                                                    draggable: true,
                                                    progress: undefined,
                                                });
                                            }
                                        }}
                                    >
                                        ACTIVATE
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="box">
                                <div className="box-title">
                                    Deactivate Premium
                                </div>
                                <div className="user-desc">
                                    Deactivating this server to activate another
                                    server? Just click the button below to
                                    deactivate this server.
                                </div>
                                <div className="center">
                                    <button
                                        className="app-button"
                                        disabled={loading}
                                        onClick={async () => {
                                            setLoading(true);
                                            try {
                                                const resp = await axios.post(
                                                    `/api/v1/guilds/premium/${id}/deactivate`,
                                                    {},
                                                    {
                                                        headers: {
                                                            "Content-Type":
                                                                "application/json",
                                                            Authorization:
                                                                process.browser
                                                                    ? window.localStorage.getItem(
                                                                          "token"
                                                                      )
                                                                    : token,
                                                        },
                                                    }
                                                );
                                                switch (resp.data.code) {
                                                    case 200:
                                                        toast.success(
                                                            resp.data.message,
                                                            {
                                                                autoClose: 5000,
                                                                hideProgressBar: false,
                                                                theme: "dark",
                                                                closeOnClick: true,
                                                                pauseOnHover: true,
                                                                draggable: true,
                                                                progress:
                                                                    undefined,
                                                            }
                                                        );
                                                        break;
                                                    case LetoaDiscordAPIErrors.SERVER_NOT_ACTIVATED:
                                                        toast.warn(
                                                            resp.data.message,
                                                            {
                                                                autoClose: 5000,
                                                                hideProgressBar: false,
                                                                theme: "dark",
                                                                closeOnClick: true,
                                                                pauseOnHover: true,
                                                                draggable: true,
                                                                progress:
                                                                    undefined,
                                                            }
                                                        );
                                                        break;

                                                    case LetoaDiscordAPIErrors.INVALID_ACCESS_TO_DEACTIVATE:
                                                        toast.warn(
                                                            resp.data.message,
                                                            {
                                                                autoClose: 5000,
                                                                hideProgressBar: false,
                                                                theme: "dark",
                                                                closeOnClick: true,
                                                                pauseOnHover: true,
                                                                draggable: true,
                                                                progress:
                                                                    undefined,
                                                            }
                                                        );
                                                        break;
                                                    default:
                                                        toast.warn(
                                                            resp.data.message,
                                                            {
                                                                autoClose: 5000,
                                                                hideProgressBar: false,
                                                                theme: "dark",
                                                                closeOnClick: true,
                                                                pauseOnHover: true,
                                                                draggable: true,
                                                                progress:
                                                                    undefined,
                                                            }
                                                        );
                                                        break;
                                                }

                                                setLoading(false);

                                                setTimeout(() => {
                                                    window.location.reload();
                                                }, 3000);
                                            } catch ({ response }) {
                                                setLoading(false);
                                                toast.error("Unknown Error", {
                                                    autoClose: 5000,
                                                    hideProgressBar: false,
                                                    theme: "dark",
                                                    closeOnClick: true,
                                                    pauseOnHover: true,
                                                    draggable: true,
                                                    progress: undefined,
                                                });
                                            }
                                        }}
                                    >
                                        DEACTIVATE
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                    <div className="page-title">{data.guild.name}</div>
                    <div className="box">
                        <div className="box-title">Overview</div>
                        <div className="user-title">
                            ROLES:{" "}
                            <span className="box-desc">
                                {data.guild.roles.length}
                            </span>
                        </div>
                        <div className="user-title">
                            CHANNELS:{" "}
                            <span className="box-desc">
                                {data.important.channels.length}
                            </span>
                        </div>
                        <div className="user-title">
                            MEMBERS:{" "}
                            <span className="box-desc">
                                {data.guild.approximate_member_count}
                            </span>
                        </div>
                        <div className="user-title">
                            REGION:{" "}
                            <span className="box-desc">
                                {data.guild.region}
                            </span>
                        </div>
                        <div className="user-title">
                            PREMIUM ACTIVATED:{" "}
                            <span className="box-desc">
                                {String(data.premium.activated)}
                            </span>
                        </div>
                    </div>

                    <div className="box">
                        <div className="box-title">Channels</div>
                        <div style={{ overflowY: "scroll", height: "150px" }}>
                            {data.channels
                                .filter(
                                    (channel) =>
                                        channel.parent_id === null &&
                                        channel.type === 0
                                )
                                .map((c) => {
                                    return (
                                        <>
                                            <div className="user-desc">
                                                <a className="icon">
                                                    <i className="fa fa-hashtag"></i>{" "}
                                                    {c.name}
                                                </a>
                                            </div>
                                        </>
                                    );
                                })}
                            {data.channels.map((channel) => {
                                if (channel.type === 4) {
                                    return (
                                        <>
                                            <div className="user-title">
                                                <a className="icon">
                                                    <i className="fa fa-chevron-down"></i>{" "}
                                                    {channel.name}
                                                </a>
                                            </div>
                                            {data.channels.map((c) => {
                                                if (
                                                    c.parent_id === channel.id
                                                ) {
                                                    return (
                                                        <>
                                                            <div className="user-desc">
                                                                <a className="icon">
                                                                    <i
                                                                        className={`fa ${
                                                                            c.type !==
                                                                            2
                                                                                ? "fa-hashtag"
                                                                                : "fa-volume-up"
                                                                        }`}
                                                                    ></i>{" "}
                                                                    {c.name}
                                                                </a>
                                                            </div>
                                                        </>
                                                    );
                                                }
                                            })}
                                        </>
                                    );
                                }
                            })}
                        </div>
                    </div>
                    <div className="box">
                        <div className="box-title">Roles</div>
                        <div
                            style={{
                                overflowY: "scroll",
                                height: "150px",
                                display: "",
                            }}
                        >
                            {data.important.roles.reverse().map((role) => {
                                return (
                                    <>
                                        <a
                                            className="icon"
                                            style={{
                                                color: "#fff",
                                                margin: "auto",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    borderRadius: "25px",
                                                    border: `2px solid #${decToHex(
                                                        role.color
                                                    )}`,
                                                    padding: "5px",
                                                    width: "25%",
                                                }}
                                            >
                                                <i
                                                    className="fa fa-circle"
                                                    style={{
                                                        color: `#${decToHex(
                                                            role.color
                                                        )}`,
                                                    }}
                                                />{" "}
                                                {role.name}
                                            </div>
                                        </a>
                                        <div style={{ height: "10px" }} />
                                    </>
                                );
                            })}
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

    return (
        <>
            <Loading />
        </>
    );
};

export default ServerManagement;
