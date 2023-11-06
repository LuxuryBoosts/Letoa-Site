import { ThreeDots } from "react-loading-icons";
import HeadTag from "./HeadTag";

const Loading = () => {
    return (
        <>
            <HeadTag title={"Desipher ― Loading"} />
            <div className="selection-container">
                <div className="middle-center">
                    <ThreeDots height={"50vh"} />
                </div>
            </div>
        </>
    );
};

export default Loading;
