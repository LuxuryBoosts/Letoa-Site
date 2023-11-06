import { useState, useEffect } from "react";
import Header from "../../../components/Header";
import HeadTag from "../../../components/HeadTag";
import { useGuilds } from "../../../context/guilds";
import Image from "next/image";
import { useRouter } from "next/router";
import { useUser } from "../../../context/user";
import { ThreeDots } from "react-loading-icons";
import { useQuery } from "react-query";
import { useToken } from "../../../context/token";
import { getUser } from "../../../api/users";
import DiscordError from "../../../errors/DiscordError";
import ImageWithFallback from "../../../components/ImageWithFallback";
import Loading from "../../../components/Loading";

const ServerManagement = () => {
    const [token] = useToken();
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
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(true);

    if (isLoading) {
        return (
            <>
                <Loading />
            </>
        );
    }

    if (isError) {
        if (error instanceof DiscordError) {
            router.push("/link/discord");

            return (
                <>
                    <Loading />
                </>
            );
        } else {
            router.push("/login");

            return (
                <>
                    <Loading />
                </>
            );
        }
    }

    if (data && !data.username) {
        router.push("/login");
    }

    return (
        <>
            <HeadTag title={"Desipher ― Manage"} />
            <Header />
            {isMobile ? <div className="mobile-seperator"></div> : <></>}
            <div className="wrapper">
                <>
                    {data.guilds.map((server, key) => {
                        return (
                            <>
                                <div
                                    onClick={() =>
                                        router.push(
                                            `/dashboard/servers/${server.id}`
                                        )
                                    }
                                    className="box"
                                    style={{
                                        textAlign: "center",
                                        cursor: "pointer",
                                    }}
                                    key={key}
                                    id={`${server.id}`}
                                >
                                    <div style={{ height: "10px" }} />
                                    <div className="ring" key={key}>
                                        <ImageWithFallback
                                            className={`added center`}
                                            src={`https://cdn.discordapp.com/icons/${server.id}/${server.icon}.webp?size=1024`}
                                            fallbackSrc={
                                                "/default.png"
                                            }
                                            height="128px"
                                            width="128px"
                                            alt="icon"
                                        />
                                    </div>
                                    <div style={{ height: "10px" }}></div>
                                    <h4 className="box-desc">{server.name}</h4>
                                </div>
                            </>
                        );
                    })}
                    <div className="dashboard-seperator" />
                </>
            </div>
        </>
    );
};

export default ServerManagement;
