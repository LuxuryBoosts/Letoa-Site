import { useQuery } from "react-query";
import { getStats } from "../api/stats";
import Footer from "../components/Footer";
import Header from "../components/Header";
import HeadTag from "../components/HeadTag";
import Stats from "../components/Stats";
import Particles from "react-tsparticles";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";

export default function Home() {
    const router = useRouter();
    const [mobile, setMobile] = useState(true);
    const [timeout, makeTimeout] = useState(true);
    const { width, height } = useWindowSize();

    function isMobile() {
        if (window.innerWidth <= 600) {
            return true;
        } else return false;
    }

    useEffect(() => {
        const ismobile = isMobile();
        setMobile(ismobile);
    });

    if (process.browser && !window.localStorage.getItem("firstTime")) {
        setTimeout(() => {
            window.localStorage.setItem("firstTime", "true");
            makeTimeout(false);
        }, 5000);
    }

    return (
        <>
            {timeout &&
            process.browser &&
            !window.localStorage.getItem("firstTime") ? (
                <>
                    <Confetti
                        width={window.innerWidth}
                        height={window.innerHeight}
                    ></Confetti>
                </>
            ) : (
                <></>
            )}

            <HeadTag title={"Desipher ― Home"} />
            <Header />

            <div className="head" style={{ overflow: "hidden" }}>
                <div className="banner-textarea" data-aos="fade-down">
                    <div className="banner-title">
                        <span style={{ fontWeight: 500 }}>Desipher</span>
                    </div>
                    <div className="banner-slogan">
                        The recovery of discord servers
                    </div>
                    <center>
                        <div
                            onClick={() => {
                                document.location.href = "#features";
                            }}
                            className="banner-button"
                        >
                            Get Started
                        </div>
                    </center>
                </div>
            </div>
            <div className="banner-image-wrapper">
                <img
                    src="/image.png"
                    className="banner-img"
                    alt={"Desipher Dashboard Preview"}
                />
            </div>
            <div className="section-container" id="features">
                <div className="center">
                    <div className="bold-line"></div>
                </div>
                <div className="section-title">Recovery Of Discord Servers</div>
                <div className="section group">
                    <div className="col span_1_of_2" data-aos="fade-right">
                        <div className="divided-title">
                            100+ Satisfied Users
                        </div>
                        <div className="divided-content">
                            Numbers don&apos;t lie. We have over 100 satisfied
                            users. We&apos;ve managed to reached this number by
                            keeping our existing customers, and having a clean,
                            unique design.
                        </div>
                    </div>
                    <div className="col span_1_of_2" data-aos="fade-left">
                        <center>
                            <div className="trustpilot">
                                <div className="trustpilot-main-box">
                                    <div className="tp-main-title">Reviews</div>
                                    <div className="tp-stars">
                                        <div className="tp-star grow">
                                            <i className="fa fa-star"></i>
                                        </div>
                                        <div className="tp-star grow">
                                            <i className="fa fa-star"></i>
                                        </div>
                                        <div className="tp-star grow">
                                            <i className="fa fa-star"></i>
                                        </div>
                                        <div className="tp-star grow">
                                            <i className="fa fa-star"></i>
                                        </div>
                                        <div className="tp-star grow">
                                            <i className="fa fa-star"></i>
                                        </div>
                                    </div>
                                    <a
                                        className="tp-link"
                                        href="https://trustpilot.com/review/desipher.io"
                                    >
                                        View all reviews
                                    </a>
                                </div>
                                <div className="trustpilot-sub-box">
                                    <div className="profiles">
                                        <img
                                            className="profile img1"
                                            src="https://i.imgur.com/MARzOmk.png"
                                            width={"50px"}
                                            height={"50px"}
                                            alt={"profile"}
                                        />
                                        <img
                                            className="profile img2"
                                            src="https://i.imgur.com/CpqMVkw.png"
                                            width={"50px"}
                                            height={"50px"}
                                            alt={"profile"}
                                        />
                                        <img
                                            className="profile img3"
                                            src="https://i.imgur.com/8ZiY7fH.png"
                                            width={"50px"}
                                            height={"50px"}
                                            alt={"profile"}
                                        />
                                        <img
                                            className="profile img4"
                                            src="https://i.imgur.com/WuCtGg6.png"
                                            width={"25px"}
                                            height={"25px"}
                                            alt={"profile"}
                                        />
                                        <img
                                            className="profile img5"
                                            src="https://i.imgur.com/ZJagaRN.png"
                                            width={"50px"}
                                            height={"50px"}
                                            alt={"profile"}
                                        />
                                        <img
                                            className="profile img6"
                                            src="https://i.imgur.com/5GwyWTT.png"
                                            width={"50px"}
                                            height={"50px"}
                                            alt={"profile"}
                                        />
                                    </div>
                                    <div className="tp-main-text">
                                        Rated <b>Excellent</b> by 75+ people.
                                    </div>
                                </div>
                            </div>
                        </center>
                    </div>
                </div>
                <div className="section group">
                    <div
                        className="col span_1_of_2"
                        data-aos="fade-right"
                        data-aos-offset="0"
                    >
                        <center>
                            <div className="dollar-box">
                                <div className="dollar-sign">$</div>
                                <div className="dollar-sign dollar-sign-zoomed">
                                    $
                                </div>
                                <div className="dollar-sign">$</div>
                            </div>
                        </center>
                    </div>
                    <div
                        className="col span_1_of_2"
                        data-aos="fade-left"
                        data-aos-offset="0"
                    >
                        <div className="divided-title">Affordable Prices</div>
                        <div className="divided-content">
                            Desipher are for everyone, we make this possible by
                            keeping our prices low. With a good price/quality
                            ratio and weekly updates, we make sure our customers
                            get the best product possible.
                        </div>
                    </div>
                </div>

                <div className="section group">
                    <div
                        className="col span_1_of_2"
                        data-aos="fade-right"
                        data-aos-offset="0"
                    >
                        <div className="divided-title">Great Support</div>
                        <div className="divided-content">
                            We have 24/7 support with staff members from all
                            over the world, helping our customers where
                            possible, regardless of the issue.
                        </div>
                    </div>
                    <div
                        className="col span_1_of_2"
                        data-aos="fade-left"
                        data-aos-offset="0"
                    >
                        <center>
                            <div className="chat-box">
                                <div className="chat-left">
                                    <div className="chat-name">Staff</div>
                                    <div className="chat-message">
                                        Hi, how can I help you?
                                    </div>
                                </div>
                                <div className="chat-right">
                                    <div className="chat-name">User</div>
                                    <div className="chat-message">
                                        Hi, I have a question.
                                    </div>
                                </div>
                                <div className="chat-typing">
                                    <span className="saving">
                                        <span>•</span>
                                        <span>•</span>
                                        <span>•</span> Staff is typing
                                    </span>
                                </div>
                                <input
                                    className="chat-sendmessage-box"
                                    placeholder="Write a reply"
                                ></input>
                            </div>
                        </center>
                    </div>
                    {/* <div className="section group">
                        <div
                            className="col span_1_of_2"
                            data-aos="fade-right"
                            data-aos-offset="0"
                        >
                            <center>
                                <div className="dollar-box">
                                    <div className="dollar-sign">
                                        <i className="mdi mdi-gold"></i>
                                    </div>
                                    <div className="dollar-sign dollar-sign-zoomed">
                                        <i className="mdi mdi-diamond"></i>
                                    </div>
                                    <div className="dollar-sign">
                                        <i className="mdi mdi-briefcase"></i>
                                    </div>
                                </div>
                            </center>
                        </div>
                        <div
                            className="col span_1_of_2"
                            data-aos="fade-left"
                            data-aos-offset="0"
                        >
                            <div className="divided-title">
                                Plans for Everyone
                            </div>
                            <div className="divided-content">
                                Letoa Backups are for every server, we offer
                                multiple plans to ensure your server and users
                                have the best experience while using Letoa. We
                                offer plans for small, large and enterprise
                                servers.
                            </div>
                        </div>
                    </div> */}
                </div>

                <div style={{ height: "25px" }} />
                <center>
                    <div className="bold-line"></div>
                </center>
            </div>

            <div
                className="wrapper-2"
                style={{
                    width: "95%",
                }}
            >
                <div className="box">
                    <div
                        className="box-title center"
                        style={{
                            fontWeight: "bolder",
                            fontSize: "20px",
                        }}
                    >
                        Ready to start using Desipher?
                    </div>
                    <div
                        className="box-desc center"
                        style={{
                            textTransform: "none",
                        }}
                    >
                        Want to start using the most advanced backup bot on
                        discord? Click the button to start your extraordinary
                        experience.
                    </div>
                    <div
                        className="app-button"
                        style={{
                            borderRadius: "5px",
                        }}
                        onClick={() => {
                            router.push("/register");
                        }}
                    >
                        Begin Now
                    </div>
                </div>
            </div>
            <div style={{ height: "50px" }} />


            <div style={{ height: "50px" }} />

            <Footer home={true} />
        </>
    );
}
