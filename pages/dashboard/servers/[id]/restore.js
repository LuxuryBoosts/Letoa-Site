import { useQuery } from "react-query";
import { useRouter } from "next/router";
import { getGuildInfo } from "../../../../api/guild";
import { useToken } from "../../../../context/token";
import { ThreeDots } from "react-loading-icons";
import DiscordError from "../../../../errors/DiscordError";
import Side from "../../../../components/Side";
import HeadTag from "../../../../components/HeadTag";
import Image from "next/image";
import Switch from "react-switch";
import Select from "react-select";
import { useState, useEffect } from "react";
import UnAuthorized from "../../../../errors/UnAuthorized";
import Loading from "../../../../components/Loading";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { LetoaDiscordAPIErrors } from "../../../../lib/codes";
import { getUserLinked } from "../../../../api/users";
import ImageWithFallback from "../../../../components/ImageWithFallback";

const Restore = () => {
    const router = useRouter();
    const { id } = router.query;
    const [token] = useToken();
    const [selectedGuild, setSelectedGuild] = useState(null);
    const [prompt, setPrompt] = useState(false);
    const [loading, setLoading] = useState(false);

    const linked = useQuery(
        [
            "user_linked",
            {
                Authorization: process.browser
                    ? window.localStorage.getItem("token")
                    : token,
            },
        ],
        getUserLinked,
        {
            retry: false,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
        }
    );

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

    const handleRestore = async () => {
        setLoading(true);
        try {
            const data = {
                restore_from: selectedGuild,
                restore_to: id,
            };

            const resp = await axios.post(
                "/api/v1/guilds/restore/members",
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
            toast.success(resp.data.message, {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                theme: "dark",
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } catch (e) {
            console.error(e);
            setLoading(false);
            toast.warn(e.response.data.message, {
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

    if (data && !isError && !isLoading) {
        return (
            <>
                <HeadTag
                    title={`Desipher - Manage ${data ? data.guild.name : null}`}
                />
                <Side id={id} platinum={data.premium.level === 3} />
                <div className="dashboard-container">
                    <div className="page-title">Restore</div>
                    <div className="box" style={{ marginBottom: "20px" }}>
                        <div className="box-title">Restore</div>
                        <div className="divider" />
                        {prompt ? (
                            <>
                                <div className="wrapper">
                                    {!linked.isLoading &&
                                    !linked.isError &&
                                    linked.data ? (
                                        <>
                                            <div className="wrapper">
                                                <div className="box-title">
                                                    Select a server to restore
                                                    members from
                                                </div>

                                                {linked.data.linked.map((r) => {
                                                    return (
                                                        <>
                                                            <div
                                                                className="box hover"
                                                                style={{
                                                                    textAlign:
                                                                        "center",
                                                                    cursor: "pointer",
                                                                }}
                                                                onClick={() => {
                                                                    if (
                                                                        selectedGuild &&
                                                                        selectedGuild ===
                                                                            r.id
                                                                    ) {
                                                                        setSelectedGuild(
                                                                            null
                                                                        );
                                                                        return;
                                                                    } else {
                                                                        setSelectedGuild(
                                                                            r.id
                                                                        );
                                                                        return;
                                                                    }
                                                                }}
                                                            >
                                                                <div
                                                                    style={{
                                                                        height: "10px",
                                                                    }}
                                                                />

                                                                <div className="ring">
                                                                    <ImageWithFallback
                                                                        className={`added center`}
                                                                        onError={(
                                                                            e
                                                                        ) =>
                                                                            e.target
                                                                        }
                                                                        src={
                                                                            r.iconURL
                                                                        }
                                                                        fallbackSrc={
                                                                            "/default.png"
                                                                        }
                                                                        height="128px"
                                                                        width="128px"
                                                                        alt="icon"
                                                                    />
                                                                </div>
                                                                <div
                                                                    style={{
                                                                        height: "10px",
                                                                    }}
                                                                />
                                                                <h4 className="box-desc">
                                                                    {r.name} -{" "}
                                                                    {r.id}
                                                                </h4>
                                                                <h4 className="box-desc">
                                                                    {r.verified}{" "}
                                                                    verified
                                                                    users
                                                                </h4>
                                                            </div>
                                                        </>
                                                    );
                                                })}

                                                <div className="box-desc center">
                                                    You currently have{" "}
                                                    {linked.data.linked.find(
                                                        (t) =>
                                                            t.id ===
                                                            selectedGuild
                                                    )
                                                        ? linked.data.linked.find(
                                                              (t) =>
                                                                  t.id ===
                                                                  selectedGuild
                                                          ).name
                                                        : "none"}{" "}
                                                    selected
                                                </div>
                                                {selectedGuild ? (
                                                    <>
                                                        <button
                                                            className="app-button"
                                                            onClick={() => {
                                                                handleRestore();
                                                            }}
                                                            disabled={loading}
                                                        >
                                                            RESTORE MEMBERS
                                                        </button>
                                                    </>
                                                ) : (
                                                    <></>
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <div
                                    className="app-button"
                                    onClick={() => {
                                        setPrompt(true);
                                    }}
                                >
                                    Show Restorable Guilds
                                </div>
                            </>
                        )}{" "}
                    </div>
                </div>
                <ToastContainer
                    position="bottom-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss={false}
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

    return <></>;
};

export default Restore;
