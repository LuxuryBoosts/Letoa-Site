import { useState } from "react";
import { useQuery } from "react-query";
import { getStats } from "../api/stats";
import Footer from "../components/Footer";
import Header from "../components/Header";
import HeadTag from "../components/HeadTag";
import Stats from "../components/Stats";
import { convertJSON } from "../lib/jwt";
import Switch from "react-switch";
import { useRouter } from "next/router";

export default function PremiumPage() {
    const [lifetime, setLifetime] = useState(false);
    const [addonLifetime, setAddonLifetime] = useState(false);
    const router = useRouter();

    return (
        <>
            <HeadTag title={"Desipher ― Premium"} />
            <Header />
            <div className="head">
                <div className="banner-textarea" data-aos="fade-down">
                    <div className="banner-title">
                        <span style={{ fontWeight: 500 }}>Desipher</span>{" "}
                        Premium
                    </div>
                    <div className="banner-slogan">
                        The recovery of discord servers
                    </div>
                </div>
            </div>
            <div className="banner-image-wrapper">
                <img src="/premium.png" className="banner-img" alt="premium" />
            </div>
            <section className="section-container">
                <div className="section-title" style={{ marginBottom: "60px" }}>
                    Our Plans
                </div>
                <div className="box-desc center">Monthly / Yearly</div>
                <div className="center">
                    <Switch
                        checked={lifetime}
                        onColor="#86d3ff"
                        onHandleColor="#2693e6"
                        width={50}
                        height={25}
                        handleDiameter={30}
                        uncheckedIcon={false}
                        checkedIcon={false}
                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                        className="react-switch"
                        id="verification-enabled"
                        onChange={(checked) => setLifetime(checked)}
                    ></Switch>
                </div>
                <div style={{ height: "25px" }} />
                <div className="app-wrapper">
                    <div className="app-box">
                        <div className="app-box-title">Gold Plan</div>
                        <div className="app-box-desc">Small Servers</div>
                        <div className="app-box-price-starting">
                            Starting at
                        </div>
                        <div className="app-box-price">
                            {!lifetime ? "$2/m" : "$10/y"}
                        </div>
                        <div className="features-list">
                            <div className="app-feature">
                                <span className="app-icon mdi mdi-check"></span>
                                Unlimited Restorable Members
                            </div>
                            <div className="app-feature">
                                <span className="app-icon mdi mdi-check"></span>
                                Full Server Restore. (Including 150 messages
                                per/channel)
                            </div>
                            <div className="app-feature">
                                <span className="app-icon mdi mdi-check"></span>
                                In App Verification Customization
                            </div>
                            <div className="app-feature">
                                <span className="app-icon mdi mdi-check"></span>
                                Emoji Backup / Restore
                            </div>
                            <div className="app-feature">
                                <span className="app-icon mdi mdi-check"></span>
                                Up to 25 Backups
                            </div>
                            <div className="app-feature">
                                <span className="app-icon mdi mdi-check"></span>
                                24/7 Support
                            </div>
                            <div className="app-feature">
                                <span className="app-icon mdi mdi-check"></span>
                                VPN / Proxy Detection
                            </div>
                            <div className="app-feature">
                                <span className="app-icon mdi mdi-check"></span>
                                Up to 5 Servers
                            </div>
                            {/* <div className="app-feature">
                                <span className="app-icon mdi mdi-check"></span>
                                Infinite Premium Servers
                            </div> */}
                        </div>
                    </div>
                    <div className="app-box">
                        <div className="app-box-title">Diamond Plan</div>
                        <div className="app-box-desc">Large Servers</div>
                        <div className="app-box-price-starting">
                            Starting at
                        </div>
                        <div className="app-box-price">
                            {!lifetime ? "$3/m" : "$20/y"}
                        </div>
                        <div className="features-list">
                            <div className="app-feature">
                                <span className="app-icon mdi mdi-check"></span>
                                All Features From Gold
                            </div>
                            <div className="app-feature">
                                <span className="app-icon mdi mdi-check"></span>
                                Full Server Restore. (Including 300 messages
                                per/channel)
                            </div>
                            <div className="app-feature">
                                <span className="app-icon mdi mdi-check"></span>
                                Up to 35 Backups
                            </div>
                            <div className="app-feature">
                                <span className="app-icon mdi mdi-check"></span>
                                Custom Verification URL
                            </div>
                            <div className="app-feature">
                                <span className="app-icon mdi mdi-check"></span>
                                Server Deletion Detection (SOON)
                            </div>
                            <div className="app-feature">
                                <span className="app-icon mdi mdi-check"></span>
                                Beta Access To New Features
                            </div>
                            <div className="app-feature">
                                <span className="app-icon mdi mdi-check"></span>
                                Up to 10 Servers
                            </div>
                        </div>
                    </div>
                    <div className="app-box">
                        <div className="app-box-title">Platinum Plan</div>
                        <div className="app-box-desc">Enterprise Servers</div>
                        <div className="app-box-price-starting">
                            Starting at
                        </div>
                        <div className="app-box-price">
                            {!lifetime ? "$8/m" : "$30/y"}
                        </div>
                        <div className="features-list">
                            <div className="app-feature">
                                <span className="app-icon mdi mdi-check"></span>
                                All Features From Diamond
                            </div>
                            <div className="app-feature">
                                <span className="app-icon mdi mdi-check"></span>
                                Custom Domain
                            </div>
                            <div className="app-feature">
                                <span className="app-icon mdi mdi-check"></span>
                                Full Server Restore. (Including 500 messages
                                per/channel)
                            </div>
                            <div className="app-feature">
                                <span className="app-icon mdi mdi-check"></span>
                                Customizable Features
                            </div>
                            <div className="app-feature">
                                <span className="app-icon mdi mdi-check"></span>
                                Up to 75 Backups
                            </div>
                            <div className="app-feature">
                                <span className="app-icon mdi mdi-check"></span>
                                Instant Server Restore (SOON)
                            </div>
                            <div className="app-feature">
                                <span className="app-icon mdi mdi-check"></span>
                                Verification Page Customization (With CSS)
                                (SOON)
                            </div>
                            <div className="app-feature">
                                <span className="app-icon mdi mdi-check"></span>
                                Up to 25 servers
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div style={{ marginTop: "-100px" }}></div>
            <section className="section-container">
                <div className="box">
                    <div style={{ marginTop: "-10px" }} />
                    <div className="center">
                        <div
                            className="app-button"
                            onClick={() => {
                                window.open("https://desipher.sellix.io/");
                            }}
                        >
                            PURCHASE
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
