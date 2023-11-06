const DashboardFooter = () => {
    return (
        <>
            <div className="dashboard-footer">
                <span className="footer-right-text">
                    <a href="/tos" className="dashboard-footer-a">
                        Terms of Service
                    </a>{" "}
                    •
                    <a href="/privacy" className="dashboard-footer-a">
                        Privacy Policy
                    </a>
                </span>
                &copy; 2020-{new Date().getFullYear()} Desipher. All rights
                reserved.
            </div>
        </>
    );
};

export default DashboardFooter;
