import Header from "../../../components/Header";
import HeadTag from "../../../components/HeadTag";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useToken } from "../../../context/token";
import { getUser, getUserBackups } from "../../../api/users";
import { ThreeDots } from "react-loading-icons";
import DiscordError from "../../../errors/DiscordError";
import apiRequest from "../../../api";
import { useRouter } from "next/router";
import Side from "../../../components/Side";
import AccountSide from "../../../components/AccountSide";
import Loading from "../../../components/Loading";
import DashboardFooter from "../../../components/DashboardFooter";
import ImageWithFallback from "../../../components/ImageWithFallback";

const BackupViewerAccount = () => {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(true);
    const [token] = useToken();
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [new_password, setNewPassword] = useState(null);
    const [loading, setLoading] = useState(false);

    const { isError, isLoading, data, error } = useQuery(
        [
            "user_backups",
            {
                Authorization: process.browser
                    ? window.localStorage.getItem("token")
                    : token,
            },
        ],
        getUserBackups,
        { retry: false }
    );

    useEffect(() => {
        if (window.innerWidth < 720) {
            setIsMobile(true);
        } else {
            setIsMobile(false);
        }
    }, []);

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
                <div className="page-title">Your Backups</div>
                <div className="box">
                    <div className="box-title">Backups</div>
                    <div className="user-title">
                        Currently {data.backups.length}{" "}
                        {data.backups.length !== 1 ? "backups" : "backup"}{" "}
                        {data.backups.length !== 1 ? "are" : "is"} linked with
                        your desipher account.
                    </div>
                    <div style={{ height: "15px" }} />
                    <div className="center">
                        <div className="bold-line"></div>
                    </div>
                    <div style={{ height: "15px" }} />
                    {data.backups.map((backup, key) => {
                        return (
                            <div className="box" key={key}>
                                <div className="flex center">
                                    <div className="round-v2-ring">
                                        <ImageWithFallback
                                            src={
                                                backup.iconURL
                                                    ? backup.iconURL
                                                    : "/default.png"
                                            }
                                            fallbackSrc={
                                                "/default.png"
                                            }
                                            className="round-v2"
                                            alt={backup.guildID}
                                            width={90}
                                            height={90}
                                        />
                                    </div>
                                </div>
                                <div style={{ height: "10px" }} />
                                <div className="user-desc-2 center">
                                    {backup.name}
                                </div>
                                <div className="user-title center">
                                    This backup was created{" "}
                                    {new Date(
                                        backup.createdTimestamp
                                    ).toLocaleString()}
                                </div>
                                <div className="user-title center">
                                    Bans: {backup.bansCount}. Roles:{" "}
                                    {backup.rolesCount}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default BackupViewerAccount;
