import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Footer = ({ home = false }) => {
    return (
        <section className="footer">
            <div className="footer-container">
                <div className="footer-description">
                    <div className="footer-desc-title">Desipher</div>
                    <div className="footer-desc-content">
                        Desipher is the most advanced backup bot on discord, and
                        since 2020, we have been providing high quality updates
                        to discord servers all around the world.
                    </div>
                </div>
                <div className="footer-url-section">
                    <div className="footer-url-group">
                        <div className="footer-url-title">Help</div>
                        <a href="/discord" target={"_blank"}>
                            <div className="footer-url">Discord</div>
                        </a>
                    </div>
                    <div className="footer-url-group">
                        <div className="footer-url-title">Legal</div>
                        <Link passHref href="/tos">
                            <div
                                className="footer-url"
                                style={{ cursor: "pointer" }}
                            >
                                Terms
                            </div>
                        </Link>
                        <Link passHref href="/privacy">
                            <div
                                style={{ cursor: "pointer" }}
                                className="footer-url"
                            >
                                Privacy
                            </div>
                        </Link>
                        <Link passHref href="/refund">
                            <div
                                style={{ cursor: "pointer" }}
                                className="footer-url"
                            >
                                Refund
                            </div>
                        </Link>
                    </div>
                </div>
                <div className="copyright-section">
                    <div style={{ height: "45px" }} />
                    <div className="copyright-divider"></div>
                    <div className="copyright-main">
                        &copy; 2020 - {new Date().getFullYear()} Desipher. All
                        rights reserved ― Developed and maintained by{" "}
                        <a
                            style={{
                                color: "lightblue",
                                textDecoration: "underline",
                            }}
                            href="https://discord.desipher.io"
                            target={"_blank"}
                            rel="noreferrer"
                        >
                            razu
                        </a>
                        {home ? (
                            <>
                                <span
                                    onClick={() => {
                                        toast.success(
                                            "Easter egg found 👀. Create a ticket in our support server ;)",
                                            {
                                                position: "top-right",
                                                autoClose: 5000,
                                                hideProgressBar: false,
                                                theme: "dark",
                                                closeOnClick: true,
                                                pauseOnHover: true,
                                                draggable: true,
                                                progress: undefined,
                                            }
                                        );
                                    }}
                                    style={{
                                        float: "right",
                                        color: "blueviolet",
                                        cursor: "pointer",
                                    }}
                                >
                                    .
                                </span>
                            </>
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
            </div>
            {home ? (
                <>
                    <ToastContainer
                        position="top-right"
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
            ) : (
                <></>
            )}
        </section>
    );
};

export default Footer;
