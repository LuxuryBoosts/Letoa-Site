import Header from "../components/Header";
import Footer from "../components/Footer";
import HeadTag from "../components/HeadTag";
import Image from "next/image";
import Link from "next/link";

const Help = () => {
    return (
        <>
            <HeadTag
                title={"Desipher ― Help"}
                description={"Running into issues? Reading this may help you."}
            />
            <Header />
            <div className="head" style={{ overflow: "hidden" }}>
                <div className="banner-textarea" data-aos="fade-down">
                    <div className="banner-title">
                        <span style={{ fontWeight: 500 }}>Desipher</span> Help
                    </div>
                    <div className="banner-slogan">
                        The recovery of discord servers
                    </div>
                </div>
            </div>
            <div className="section-container">
                <div className="section-title">How do I access my backups?</div>
                <div className="section group center">
                    <div className="divided-content">
                        You may access your backups by heading to your account
                        dashboard, and then clicking on backups. That page will
                        display all your backups linked to your{" "}
                        <span style={{ fontWeight: "bold" }}>Desipher</span>{" "}
                        account.
                    </div>
                </div>
                <div style={{ height: "25px" }}></div>
                <div className="center">
                    <div className="bold-line"></div>
                </div>
                <div style={{ height: "25px" }}></div>
                <div className="section-title">
                    How do I see my verified users?
                </div>
                <div className="section group center">
                    <div className="divided-content">
                        You can access who has verified by going to your account
                        dashboard, then clicking on Verified Users. This will
                        then show all verified users from across your servers.
                    </div>
                </div>
                <div style={{ height: "25px" }}></div>
                <div className="center">
                    <div className="bold-line"></div>
                </div>
                <div style={{ height: "25px" }}></div>
                <div className="section-title">
                    How do I restore my members?
                </div>
                <div className="section group center">
                    <div className="divided-content">
                        You may restore your members by inviting the discord bot
                        to the server where you want to restore. Heading to
                        Servers Dashboard &gt; Your Server &gt; Restore &gt;
                        Restore From Guild &gt; Start. This will then start
                        adding all your verified users from the restore guild.
                    </div>
                </div>
                <div style={{ height: "25px" }}></div>
                <div className="center">
                    <div className="bold-line"></div>
                </div>
                <div style={{ height: "25px" }}></div>
                <div className="section-title">Need more assistance?</div>
                <div className="section group center">
                    <div className="divided-content">
                        You can join our discord server and contact our support
                        team. By telling us what your problem is, we will be
                        able to help. You may join our discord server{" "}
                        <Link href="/discord">
                            <a style={{ color: "#3768d9" }}>here</a>
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Help;
