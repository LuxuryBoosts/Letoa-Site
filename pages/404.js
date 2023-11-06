import Footer from "../components/Footer";
import Header from "../components/Header";
import HeadTag from "../components/HeadTag";

const ErrorPage = () => {
    return (
        <>
            <HeadTag title={"Desipher ― 404"} />
            <Header />
            <div className="title-area">
                <div className="big">404</div>
                <div className="medium">Page Not Found</div>
                <div className="description">
                    We couldn’t find the page you were looking for.
                </div>
                <p
                    className="go-back pointer"
                    onClick={() => window.history.back()}
                >
                    Go Back
                </p>
            </div>
        </>
    );
};

export default ErrorPage;
