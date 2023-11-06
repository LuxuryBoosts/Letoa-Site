import Header from "../../../components/Header";
import HeadTag from "../../../components/HeadTag";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useToken } from "../../../context/token";
import {
    getUser,
    getUserBackups,
    getUserVerifiedUsers,
} from "../../../api/users";
import { ThreeDots } from "react-loading-icons";
import DiscordError from "../../../errors/DiscordError";
import apiRequest from "../../../api";
import { useRouter } from "next/router";
import Side from "../../../components/Side";
import AccountSide from "../../../components/AccountSide";
import Loading from "../../../components/Loading";
import ImageWithFallback from "../../../components/ImageWithFallback";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";

const UsersViewer = () => {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(true);
    const [token] = useToken();
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [new_password, setNewPassword] = useState(null);
    const [loading, setLoading] = useState(false);

    const { isError, isLoading, data, error } = useQuery(
        [
            "user_verified_users",
            {
                Authorization: process.browser
                    ? window.localStorage.getItem("token")
                    : token,
            },
        ],
        getUserVerifiedUsers,
        { retry: false }
    );

    useEffect(() => {
        if (window.innerWidth < 720) {
            setIsMobile(true);
        } else {
            setIsMobile(false);
        }
    }, []);

    const handleBan = async (guildId, userId, banned) => {
        const methods = ["delete", "put"];

        try {
            const resp = await axios[methods[banned]](
                `/api/v1/bans/${guildId}/user/${userId}`,
                {},
                {
                    headers: {},
                }
            );
        } catch (e) {}
        console.log("handling the click for ", guildId, userId);
    };

    if (loading) {
        return <Loading />;
    }

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

    return (
        <>
            <HeadTag title={"Desipher - Account"} />
            <AccountSide
                admin={data.admin}
                platinum={data.premiumLevel === 3}
                customBots={data.allowedCustomBots}
            />
            <div className="dashboard-container">
                {isMobile ? <div style={{ height: "15px" }}></div> : <></>}
                <div className="page-title">Your Verified Users</div>
                <div className="box">
                    <div className="box-title">Users</div>
                    <div className="user-title">
                        These are all the guilds linked to your Desipher
                        account.
                    </div>
                    <div style={{ height: "15px" }} />
                    <div className="center">
                        <div className="bold-line"></div>
                    </div>
                    <div style={{ height: "15px" }} />
                    {data.users.map((backup, key) => {
                        return (
                            <>
                                <Accordion
                                    style={{
                                        backgroundColor: "transparent",
                                        boxShadow:
                                            "0 0 30px 0 rgba(0, 0, 0, 0.1)",
                                    }}
                                    TransitionProps={{ unmountOnExit: true }}
                                >
                                    <AccordionSummary
                                        expandIcon={
                                            <ExpandMoreIcon
                                                style={{ color: "#fff" }}
                                            />
                                        }
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                        backgroundColor="#000"
                                    >
                                        <div className="user-box" key={key}>
                                            <div className="flex center">
                                                <div className="round-v2-ring">
                                                    <ImageWithFallback
                                                        src={backup.iconURL}
                                                        className="round-v2"
                                                        alt={backup.name}
                                                        width={90}
                                                        height={90}
                                                        fallbackSrc={
                                                            "/default.png"
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div style={{ height: "10px" }} />
                                            <div className="user-desc-2 center">
                                                {backup.name}
                                            </div>
                                            <div className="user-title center">
                                                {backup.users.length} users are
                                                verified.
                                            </div>
                                        </div>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        {backup.users.map((v, i) => {
                                            return (
                                                <>
                                                    <div
                                                        className="box"
                                                        key={i}
                                                    >
                                                        <div className="flex center">
                                                            <div className="round-v2-ring">
                                                                <ImageWithFallback
                                                                    src={
                                                                        v.avatar
                                                                            ? `https://cdn.discordapp.com/avatars/${v.discordId}/${v.avatar}.webp`
                                                                            : "/default.png"
                                                                    }
                                                                    className="round-v2"
                                                                    alt={
                                                                        v.discordTag
                                                                            ? v.discordTag
                                                                            : "Unknown"
                                                                    }
                                                                    width={90}
                                                                    height={90}
                                                                    fallbackSrc={
                                                                        "/default.png"
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                        <div
                                                            style={{
                                                                height: "10px",
                                                            }}
                                                        />
                                                        <div className="user-desc-2 center">
                                                            {v.discordTag
                                                                ? v.discordTag
                                                                : "Unknown"}
                                                        </div>
                                                        <div className="user-title center">
                                                            {v.discordId}
                                                        </div>
                                                        {/* <div className="center">
                                                            <div
                                                                className="app-button"
                                                                style={{
                                                                    width: "25%",
                                                                }}
                                                                onClick={() => {
                                                                    handleBan(
                                                                        backup.guildID,
                                                                        v.discordId,
                                                                        v.banned
                                                                            ? 0
                                                                            : 1
                                                                    );
                                                                }}
                                                            >
                                                                {v.banned
                                                                    ? "UNBAN IP"
                                                                    : "BAN IP"}
                                                            </div> */}
                                                        {/* </div> */}
                                                    </div>
                                                </>
                                            );
                                        })}
                                    </AccordionDetails>
                                </Accordion>
                            </>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default UsersViewer;
