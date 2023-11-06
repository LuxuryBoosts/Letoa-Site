import { useEffect } from "react";
import { useQuery } from "react-query";
import { getStats } from "../api/stats";
import { useStats } from "../context/stats";

const Stats = () => {
    const { data } = useQuery("stats", getStats);

    return (
        <>
            <div className="section-title" style={{ marginBottom: "60px" }}>
                Desipher Statistics
            </div>

            <div className="center">
                <div className="app-wrapper-2">
                    <div className="app-box-3">
                        <div className="app-box-title">
                            {data ? data.stats?.guilds : 0}
                        </div>
                        <div className="app-box-desc">Guilds</div>
                    </div>
                    <div className="app-box-3">
                        <div className="app-box-title">
                            {data ? data.stats?.authorizedUsers : 0}
                        </div>
                        <div className="app-box-desc">Verified Users</div>
                    </div>
                    <div className="app-box-3">
                        <div className="app-box-title">
                            {data ? data.stats?.backups : 0}
                        </div>
                        <div className="app-box-desc">Backups</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Stats;
