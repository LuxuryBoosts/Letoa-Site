import { useEffect, useState } from "react";
import Header from "../../components/Header";
import HeadTag from "../../components/HeadTag";
import Image from "next/image";
import { useRouter } from "next/router";
import { ThreeDots } from "react-loading-icons";
import DashboardLayout from "../../layouts/dashboard";
import useSWR from "swr";
import { useToken } from "../../context/token";
import { useQuery } from "react-query";
import { getUser } from "../../api/users";
import DiscordError from "../../errors/DiscordError";
import Loading from "../../components/Loading";

const Dashboard = () => {
    const [token] = useToken();
    const { isError, isLoading, error } = useQuery(
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
    const [isMobile, setIsMobile] = useState(true);
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (window.innerWidth < 720) {
            setIsMobile(true);
        } else {
            setIsMobile(false);
        }
    }, []);

    if (isLoading) {
        return <Loading />;
    }

    if (isError) {
        if (error instanceof DiscordError) {
            router.push("/link/discord");
            return <Loading />;
        }
        router.push("/login");
        return <Loading />;
    }

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            <HeadTag title={"Desipher ― Dashboard"} />
            <Header />
            {isMobile ? <div className="mobile-seperator"></div> : <></>}
            <div className="selection-container">
                <div
                    className="selection-box pointer grow"
                    style={{ marginBottom: "20px" }}
                    onClick={() => {
                        setLoading(true);
                        router.push("/dashboard/account");
                    }}
                >
                    <div className="middle-center">
                        <div className="changelog-header">
                            <i
                                className="fa fa-cogs"
                                style={{ color: "#FFF" }}
                            ></i>{" "}
                            Manage Your Account
                        </div>
                    </div>

                    <div className="user-desc middle-center">
                        Manage your account settings, viewing backups, and
                        viewing verified users across all servers.
                    </div>
                </div>
                <div style={{ height: "50px" }} />
                <div
                    className="selection-box pointer grow"
                    style={{ marginBottom: "20px" }}
                    onClick={() => {
                        setLoading(true);
                        router.push("/dashboard/servers");
                    }}
                >
                    <div className="middle-center">
                        <div className="changelog-header">
                            <i
                                className="fa fa-server"
                                style={{ color: "#FFF" }}
                            ></i>{" "}
                            Manage Your Servers
                        </div>
                    </div>

                    <div className="user-desc middle-center">
                        Manage your discord servers, configure their settings,
                        and get started.
                    </div>
                </div>
            </div>
        </>
    );
};

Dashboard.getLayout = (page) => {
    return <DashboardLayout>{page}</DashboardLayout>;
};

export default Dashboard;
