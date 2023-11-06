import HeadTag from "../../components/HeadTag";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { ThreeDots } from "react-loading-icons";
import { useRouter } from "next/router";
import Loading from "../../components/Loading";

export async function getServerSideProps({ query }) {
    return {
        props: {
            redirect: query.redirect ? query.redirect : null,
            verification: query.verification ? query.verification : null,
        },
    };
}

const LinkDiscordToLetoa = ({ redirect, verification }) => {
    const [isMobile, setIsMobile] = useState(true);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (window.innerWidth < 720) {
            setIsMobile(true);
        } else {
            setIsMobile(false);
        }
    });

    if (loading) {
        return (
            <>
                <Loading />
            </>
        );
    }

    return (
        <>
            <HeadTag title={"Desipher ― Link Discord"} />
            <Header />
            {isMobile ? <div className="mobile-seperator"></div> : <></>}
            <div className="selection-container">
                <div className="box-4">
                    <div className="middle-center">
                        <div className="changelog-header">
                            {verification
                                ? "Login to Discord"
                                : "Link Your Discord Account"}
                        </div>
                    </div>
                    <div className="user-desc middle-center">
                        {verification
                            ? "By logging into discord, you will have access to verify in servers."
                            : "By linking your discord account, you will have access to manage your backups and manage your settings."}
                    </div>
                    <div>
                        <button
                            className="app-button"
                            onClick={() => {
                                setLoading(true);
                                setTimeout(() => {
                                    router.push(
                                        `/api/v1/auth/discord/redirect?redirect=${
                                            redirect ? redirect : "/dashboard"
                                        }`
                                    );
                                }, 3000);
                            }}
                        >
                            {verification ? "Login Now" : "Link Now"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LinkDiscordToLetoa;
