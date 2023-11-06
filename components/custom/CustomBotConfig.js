import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const Box = () => {};

export const CustomBotConfig = ({ custom, config }) => {
    return (
        <>
            {custom.map((v) => {
                return (
                    <>
                        <Accordion
                            style={{
                                backgroundColor: "#131A2E",
                                boxShadow: "0 0 30px 0 rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            <AccordionSummary
                                expandIcon={
                                    <ExpandMoreIcon style={{ color: "#fff" }} />
                                }
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                                backgroundColor="#000"
                            >
                                <div className="settings-box">
                                    <div className="box-desc">{v}</div>
                                </div>
                            </AccordionSummary>
                            <AccordionDetails
                                style={{
                                    backgroundColor: "#131A2E",
                                    boxShadow: "0 0 30px 0 rgba(0, 0, 0, 0.1)",
                                }}
                            >
                                {Object.values(config)
                                    .filter((s) => s.id === v)
                                    .map((r) => {
                                        return (
                                            <>
                                                {Object.entries(r).map((y) => {
                                                    return (
                                                        <>
                                                            <div className="box-desc">
                                                                {y[0]}
                                                                {/* <span
                                                                style={{
                                                                    marginTop:
                                                                        "-4px",
                                                                    clear: "both",
                                                                    float: "right",
                                                                }}
                                                            >
                                                                 <Switch
                                                                    checked={active}
                                                                    onColor="#86d3ff"
                                                                    onHandleColor="#2693e6"
                                                                    width={50}
                                                                    height={25}
                                                                    handleDiameter={30}
                                                                    uncheckedIcon={
                                                                        false
                                                                    }
                                                                    checkedIcon={false}
                                                                    boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                                                                    activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                                                                    className="react-switch"
                                                                    id="verification-enabled"
                                                                    onChange={(v) => {
                                                                        setActive(v);
                                                                    }}
                                                                /> 
                                                            </span> */}
                                                            </div>
                                                            <div
                                                                style={{
                                                                    height: "10px",
                                                                }}
                                                            />
                                                        </>
                                                    );
                                                })}
                                            </>
                                        );
                                    })}
                            </AccordionDetails>
                        </Accordion>
                        <div className="divider" />
                    </>
                );
            })}
        </>
    );
};
