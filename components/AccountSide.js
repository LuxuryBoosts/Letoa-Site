import Link from "next/link";
import $ from "jquery";
import { useRouter } from "next/router";

const AccountSide = ({
    admin = false,
    platinum = false,
    customBots = false,
}) => {
    const router = useRouter();

    const handleClick = () => {
        $(".sidebar").slideToggle("fast");
    };

    return (
        <>
            <div className="show-more" id="show-menu" onClick={handleClick}>
                <span className="mdi mdi-menu"></span>
            </div>
            <div className="sidebar">
                <Link href="/" passHref>
                    <div className="sidebar-title pointer">DISPHER</div>
                </Link>
                <div className="sidebar-menu">
                    <div className="sidebar-category">Overview</div>
                    <Link href={"/dashboard/account"} passHref>
                        <div
                            className={`pointer sidebar-item  ${
                                !window.location
                                    .toString()
                                    .includes("/backups") &&
                                !window.location
                                    .toString()
                                    .includes("/platinum") &&
                                !window.location
                                    .toString()
                                    .includes("/admin") &&
                                !window.location.toString().includes("/users")
                                    ? "sidebar-item-active"
                                    : ""
                            }`}
                        >
                            <span className="sidebar-item-icon mdi mdi-information-outline"></span>{" "}
                            Overview
                        </div>
                    </Link>
                </div>
                <div className="sidebar-category">Backup Management</div>
                <Link href={"/dashboard/account/backups"} passHref>
                    <div
                        className={`pointer sidebar-item ${
                            window.location.toString().includes("backups")
                                ? "sidebar-item-active"
                                : ""
                        }`}
                    >
                        {" "}
                        <span className="sidebar-item-icon mdi mdi-cloud-upload-outline"></span>{" "}
                        Backups
                    </div>
                </Link>
                <div className="sidebar-category">User Management</div>
                <Link href={"/dashboard/account/users"} passHref>
                    <div
                        className={`pointer sidebar-item ${
                            window.location.toString().includes("users")
                                ? "sidebar-item-active"
                                : ""
                        }`}
                    >
                        <span className="sidebar-item-icon mdi mdi-account-multiple-outline"></span>{" "}
                        Verified Users
                    </div>
                </Link>
                {admin ? (
                    <>
                        <div className="sidebar-category">
                            Desipher Management
                        </div>
                        <Link href={"/dashboard/account/admin"} passHref>
                            <div
                                className={`pointer sidebar-item ${
                                    window.location.toString().includes("admin")
                                        ? "sidebar-item-active"
                                        : ""
                                }`}
                            >
                                <span className="sidebar-item-icon mdi mdi-shield-star-outline"></span>{" "}
                                Admin Panel
                            </div>
                        </Link>
                    </>
                ) : (
                    <></>
                )}
                {platinum ? (
                    <>
                        <div className="sidebar-category">Platinum</div>
                        <Link href={`/dashboard/account/platinum`} passHref>
                            <div
                                className={`pointer sidebar-item ${
                                    window.location
                                        .toString()
                                        .includes("platinum")
                                        ? "sidebar-item-active"
                                        : ""
                                }`}
                            >
                                <span className="sidebar-item-icon mdi mdi-shield-star-outline"></span>{" "}
                                Platinum Settings
                            </div>
                        </Link>
                    </>
                ) : (
                    <></>
                )}
                <div className="sidebar-category">Help</div>
                <Link href="/discord" target="_blank" passHref>
                    <div className="pointer sidebar-item">
                        <span className="sidebar-item-icon mdi mdi-discord"></span>{" "}
                        Discord
                    </div>
                </Link>
            </div>
        </>
    );
};

export default AccountSide;
