import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ApiConfig, WebsiteConfig } from "../lib/config";
import { handleOauthLogin } from "../utils/oauth";
import { useToken } from "../context/token";
import { useUser } from "../context/user";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import TransparentImage from "../public/assets/images/transparent_logo.png";
import { getUser } from "../api/users";

const fetcher = (url, authorization) =>
    fetch(url, {
        headers: {
            authorization,
        },
    }).then((res) => res.json());

const Header = () => {
    const [token, setToken] = useToken();
    const { isSuccess, data, isLoading } = useQuery(
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
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            retry: false,
        }
    );
    const router = useRouter();

    const openNav = () => {
        const x = document.getElementById("navbar");
        if (x.className === "nav-bar") {
            x.className += " responsive";
        } else {
            x.className = "nav-bar";
        }
    };

    return (
        <>
            <div className="nav-bar" id="navbar">
                {/* <Link href="/" passhref="true">
                    <a className="nav-bar-logo">
                        <Image
                            src={TransparentImage}
                            alt="logo"
                            width={"30px"}
                            height={"30px"}
                        />
                    </a>
                </Link> */}
                <Link href="/bot" passhref="true">
                    Bot Invite
                </Link>
                <Link href="/premium" passhref="true">
                    Premium
                </Link>
                <Link href="/discord" passhref="true">
                    Support
                </Link>
                {isLoading ? (
                    <></>
                ) : (
                    <>
                        {isSuccess && data.username ? (
                            <>
                                <Link href="/dashboard" passhref="true">
                                    Dashboard
                                </Link>
                                <a
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                        setToken(null);
                                        document.location.reload();
                                    }}
                                >
                                    <span className="mdi mdi-logout-variant"></span>
                                </a>
                            </>
                        ) : (
                            <>
                                <a
                                    className="pointer"
                                    onClick={() => {
                                        router.push("/login");
                                    }}
                                >
                                    Login
                                </a>
                            </>
                        )}
                    </>
                )}
                <a className="icon" onClick={openNav}>
                    <i className="fa fa-bars"></i>
                </a>
            </div>
        </>
    );
};

export default Header;
