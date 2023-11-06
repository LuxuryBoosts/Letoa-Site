import Link from "next/link";
import $ from "jquery";

const Side = ({ platinum = false, id = null }) => {
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
                    <Link href={`/dashboard/servers/${id}`} passHref>
                        <div
                            className={`pointer sidebar-item  ${
                                !window.location
                                    .toString()
                                    .includes("/users") &&
                                !window.location
                                    .toString()
                                    .includes("/verification") &&
                                !window.location
                                    .toString()
                                    .includes("/backup") &&
                                !window.location
                                    .toString()
                                    .includes("/platinum") &&
                                !window.location.toString().includes("/restore")
                                    ? "sidebar-item-active"
                                    : ""
                            }`}
                        >
                            <span className="sidebar-item-icon mdi mdi-information-outline"></span>{" "}
                            Overview
                        </div>
                    </Link>
                    <div className="sidebar-category">Server</div>
                    <Link
                        href={`/dashboard/servers/${id}/verification`}
                        passHref
                    >
                        <div
                            className={`pointer sidebar-item ${
                                window.location
                                    .toString()
                                    .includes("verification")
                                    ? "sidebar-item-active"
                                    : ""
                            }`}
                        >
                            <span className="sidebar-item-icon mdi mdi-robot-vacuum-variant"></span>{" "}
                            Verification
                        </div>
                    </Link>
                    <Link href={`/dashboard/servers/${id}/restore`} passHref>
                        <div
                            className={`pointer sidebar-item ${
                                window.location.toString().includes("restore")
                                    ? "sidebar-item-active"
                                    : ""
                            }`}
                        >
                            <span className="sidebar-item-icon mdi mdi-cloud-download-outline"></span>{" "}
                            Restore
                        </div>
                    </Link>
                </div>
                {platinum ? (
                    <>
                        <div className="sidebar-category">Platinum</div>
                        <Link
                            href={`/dashboard/servers/${id}/platinum`}
                            passHref
                        >
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
                                Platinum Panel
                            </div>
                        </Link>
                    </>
                ) : (
                    <></>
                )}
                <div className="sidebar-category">Help</div>
                <Link passHref href="/help">
                    <div className="pointer sidebar-item">
                        <span className="sidebar-item-icon mdi mdi-frequently-asked-questions"></span>{" "}
                        FAQ
                    </div>
                </Link>
                <p
                    onClick={() => redirectToDiscord({ popup: true })}
                    className="pointer sidebar-item"
                >
                    <span className="sidebar-item-icon mdi mdi-discord"></span>{" "}
                    Discord
                </p>
            </div>
        </>
    );
};

export default Side;
