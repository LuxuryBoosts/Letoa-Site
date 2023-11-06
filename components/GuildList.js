import { useEffect, useState } from "react";

const GuildList = ({ guilds }) => {
    const [isMobile, setIsMobile] = useState(true);

    useEffect(() => {
        if (window.innerWidth < 720) {
            setIsMobile(true);
        } else {
            setIsMobile(false);
        }
    }, []);

    return (
        <>
            {isMobile ? <div className="mobile-seperator"></div> : <></>}
            <div className="wrapper"></div>
        </>
    );
};

export default GuildList;
