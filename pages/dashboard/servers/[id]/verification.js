import { useQuery } from "react-query";
import { useRouter } from "next/router";
import { getGuildInfo } from "../../../../api/guild";
import { useToken } from "../../../../context/token";
import { ThreeDots } from "react-loading-icons";
import DiscordError from "../../../../errors/DiscordError";
import Side from "../../../../components/Side";
import HeadTag from "../../../../components/HeadTag";
import Switch from "react-switch";
import Select from "react-select";
import { useState, useEffect } from "react";
import UnAuthorized from "../../../../errors/UnAuthorized";
import Loading from "../../../../components/Loading";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { LetoaDiscordAPIErrors } from "../../../../lib/codes";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const VerificationSettings = () => {
    const colourStyles = {
        control: (styles) => ({
            ...styles,
            backgroundColor: "",
            border: 0,
            boxShadow: "none",
        }),
        menuList: (styles) => ({
            ...styles,
            backgroundColor: "#151F39",
        }),
        option: (styles) => {
            return {
                ...styles,
                backgroundColor: "#151F39",
                color: "#fff",
            };
        },
        placeholder: (style) => {
            return {
                ...style,
                color: "#fff",
            };
        },
        singleValue: (style) => {
            return {
                ...style,
                color: "#fff",
            };
        },
    };

    function isValidURL(string) {
        var res = string.match(
            /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
        );
        return res !== null;
    }

    const router = useRouter();
    const { id } = router.query;
    const [token] = useToken();
    const [verificationEnabled, setverificationEnabled] = useState(false);
    const [verificationRole, setVerificationRole] = useState(null);
    const [loggingChannel, setLoggingChannel] = useState(null);
    const [options, setOptions] = useState([]);
    const [channelOptions, setChannelOptions] = useState([]);
    const [redirectUrl, setRedirectUrl] = useState(null);
    const [customLink, setCustomLink] = useState(null);
    const [inAppCustomMessage, setInAppCustomMessage] = useState(null);
    const [inAppCustomButton, setInAppCustomButton] = useState(null);
    const [inAppEmbedColor, setInAppEmbedColor] = useState(null);
    const [inAppCustomImage, setInAppCustomImage] = useState(null);
    const [vpnCheck, setVpnCheck] = useState(false);
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    const { data, isLoading, isError, error } = useQuery(
        [
            "guild",
            {
                Authorization: process.browser
                    ? window.localStorage.getItem("token")
                    : token,
                GuildID: id,
            },
        ],
        getGuildInfo,
        {
            retry: false,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
        }
    );

    const handleSave = async () => {
        try {
            if (inAppCustomImage && !isValidURL(inAppCustomImage)) {
                toast.error("An invalid image was provided.", {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    theme: "dark",
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                return;
            }

            setSaving(true);
            const data = {
                verificationEnabled: verificationEnabled
                    ? verificationEnabled
                    : false,
                loggingChannel: loggingChannel ? loggingChannel : null,
                verificationRole: verificationRole ? verificationRole : null,
                redirectUrl: redirectUrl ? redirectUrl : null,
                customLink: customLink ? customLink : null,
                inAppButtonText: inAppCustomButton ? inAppCustomButton : null,
                inAppCustomImage: inAppCustomImage ? inAppCustomImage : null,
                inAppCustomMessage: inAppCustomMessage
                    ? inAppCustomMessage
                    : null,
                inAppEmbedColor: inAppEmbedColor ? inAppEmbedColor : null,
                vpnCheck: vpnCheck ? vpnCheck : false,
            };

            const resp = await axios.post(`/api/v1/guilds/${id}`, data, {
                headers: {
                    Authorization: process.browser
                        ? window.localStorage.getItem("token")
                        : token,
                    "Content-Type": "application/json",
                },
            });

            setSaving(false);

            switch (resp.data.code) {
                case 200:
                    toast.success("Settings have successfully been saved!", {
                        position: "bottom-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        theme: "dark",
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    break;
                case LetoaDiscordAPIErrors.INVALID_ROLE_PROVIDED:
                    toast.error(resp.data.message, {
                        position: "bottom-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        theme: "dark",
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    break;
                case LetoaDiscordAPIErrors.INVALID_CHANNEL_PROVIDED:
                    toast.error(resp.data.message, {
                        position: "bottom-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        theme: "dark",
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    break;
                case LetoaDiscordAPIErrors.PROVIDED_ROLE_NOT_ACCESSABLE:
                    toast.error(resp.data.message, {
                        position: "bottom-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        theme: "dark",
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    break;
                case LetoaDiscordAPIErrors.CUSTOM_LINK_ALREADY_EXISTS:
                    toast.error(resp.data.message, {
                        position: "bottom-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        theme: "dark",
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    break;
                case LetoaDiscordAPIErrors.BLACKLISTED_CUSTOM_LINK:
                    toast.error(resp.data.message, {
                        position: "bottom-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        theme: "dark",
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    break;
                default:
                    toast.warn(resp.data.message, {
                        autoClose: 5000,
                        hideProgressBar: false,
                        theme: "dark",
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    break;
            }
        } catch (e) {
            toast.error("Failed to save settings!", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                theme: "dark",
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    function hexadecimalToString(hex) {
        var string = "";
        for (var i = 0; i < hex.length; i += 2) {
            string += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        }
        console.log(string);
        return string;
    }

    useEffect(() => {
        data
            ? setverificationEnabled(data.settings.verification.enabled)
            : setverificationEnabled(false);
        const d = [];
        if (data) {
            for (let r of data.important.roles.reverse())
                d.push({ value: r.id, label: r.name });
            data ? setOptions(d) : setOptions([]);
        }
        const t = [];
        if (data) {
            for (let c of data.important.channels)
                t.push({ value: c.id, label: c.name });
            data ? setChannelOptions(t) : setChannelOptions([]);
        }
        data
            ? setVerificationRole(data.settings.verification.role)
            : setVerificationRole(null);
        data
            ? setLoggingChannel(data.settings.verification.logging)
            : setLoggingChannel(null);
        data
            ? setRedirectUrl(data.settings.verification.redirectUrl)
            : setRedirectUrl(null);
        data
            ? setCustomLink(data.settings.verification.customLink)
            : setCustomLink(null);
        data
            ? setInAppCustomMessage(
                  data.settings.verification.inAppCustomMessage
              )
            : setInAppCustomMessage(null);
        data
            ? setInAppCustomButton(data.settings.verification.inAppButtonText)
            : setInAppCustomButton(null);
        data
            ? setInAppEmbedColor(data.settings.verification.inAppEmbedColor)
            : setInAppEmbedColor(null);
        data
            ? setInAppCustomImage(data.settings.verification.inAppCustomImage)
            : setInAppCustomImage(null);
        data
            ? setVpnCheck(data.settings.verification.vpnCheck)
            : setVpnCheck(false);
    }, [data]);

    if (isLoading && process.browser) {
        return (
            <>
                <Loading />
            </>
        );
    }

    if (isError) {
        if (error instanceof DiscordError) {
            router.push("/link/discord");
            return <Loading />;
        } else if (error instanceof UnAuthorized) {
            router.push("/dashboard/servers");
            return <Loading />;
        } else {
            router.push("/login");
            return <Loading />;
        }
    }

    if (data && !isError && !isLoading) {
        return (
            <>
                <HeadTag
                    title={`Desipher - Manage ${data ? data.guild.name : null}`}
                />
                <Side id={id} platinum={data.premium.level === 3} />
                <div className="dashboard-container">
                    <div className="page-title">Verification Information</div>
                    <div className="section group">
                        <div className="col dashboard-span_1_of_2">
                            <div
                                className="box"
                                style={{ marginBottom: "20px" }}
                            >
                                <div className="box-title">VERIFICATION</div>
                                <div className="divider" />

                                <Accordion
                                    style={{
                                        backgroundColor: "#131A2E",
                                        boxShadow:
                                            "0 0 30px 0 rgba(0, 0, 0, 0.1)",
                                    }}
                                >
                                    <AccordionSummary
                                        expandIcon={
                                            <ExpandMoreIcon
                                                style={{
                                                    color: "#fff",
                                                }}
                                            />
                                        }
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                        backgroundColor="#000"
                                    >
                                        <div className="settings-box">
                                            <div className="box-desc">
                                                Main Verification Settings
                                            </div>
                                        </div>
                                    </AccordionSummary>
                                    <AccordionDetails
                                        style={{
                                            backgroundColor: "#131A2E",
                                            boxShadow:
                                                "0 0 30px 0 rgba(0, 0, 0, 0.1)",
                                        }}
                                    >
                                        <div className="box-desc">
                                            Verification Enabled{" "}
                                            <span
                                                style={{
                                                    float: "right",
                                                    marginTop: "-4px",
                                                    clear: "both",
                                                }}
                                            >
                                                <Switch
                                                    checked={
                                                        verificationEnabled
                                                    }
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
                                                    onChange={(checked) =>
                                                        setverificationEnabled(
                                                            checked
                                                        )
                                                    }
                                                />
                                            </span>
                                        </div>
                                        <div style={{ height: "10px" }} />
                                        <div className="box-desc">
                                            Verification Role
                                            <div style={{ height: "10px" }} />
                                            <span
                                                style={{
                                                    marginTop: "-4px",
                                                    clear: "both",
                                                }}
                                            >
                                                <Select
                                                    options={options}
                                                    isClearable={true}
                                                    isSearchable={true}
                                                    className="input"
                                                    value={
                                                        verificationRole !==
                                                        null
                                                            ? options[
                                                                  options.findIndex(
                                                                      (i) =>
                                                                          i.value ===
                                                                          verificationRole
                                                                  )
                                                              ]
                                                            : null
                                                    }
                                                    styles={colourStyles}
                                                    onChange={(v) => {
                                                        setVerificationRole(
                                                            v ? v.value : null
                                                        );
                                                    }}
                                                />
                                            </span>
                                        </div>
                                        <div style={{ height: "10px" }} />
                                        <div className="box-desc">
                                            Logging Channel
                                            <div style={{ height: "10px" }} />
                                            <span
                                                style={{
                                                    marginTop: "-4px",
                                                    clear: "both",
                                                }}
                                            >
                                                <Select
                                                    options={channelOptions}
                                                    isClearable={true}
                                                    isSearchable={true}
                                                    className="input"
                                                    value={
                                                        loggingChannel !== null
                                                            ? channelOptions[
                                                                  channelOptions.findIndex(
                                                                      (i) =>
                                                                          i.value ===
                                                                          loggingChannel
                                                                  )
                                                              ]
                                                            : null
                                                    }
                                                    styles={colourStyles}
                                                    onChange={(v) => {
                                                        setLoggingChannel(
                                                            v ? v.value : null
                                                        );
                                                    }}
                                                />
                                            </span>
                                        </div>
                                    </AccordionDetails>
                                </Accordion>

                                <div style={{ height: "10px" }} />

                                {data.premium.level >= 1 ? (
                                    <>
                                        <Accordion
                                            style={{
                                                backgroundColor: "#131A2E",
                                                boxShadow:
                                                    "0 0 30px 0 rgba(0, 0, 0, 0.1)",
                                            }}
                                        >
                                            <AccordionSummary
                                                expandIcon={
                                                    <ExpandMoreIcon
                                                        style={{
                                                            color: "#fff",
                                                        }}
                                                    />
                                                }
                                                aria-controls="panel1a-content"
                                                id="panel1a-header"
                                                backgroundColor="#000"
                                            >
                                                <div className="settings-box">
                                                    <div className="box-desc">
                                                        In App Settings
                                                    </div>
                                                </div>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <div
                                                    style={{ height: "10px" }}
                                                />
                                                <div className="box-desc">
                                                    In App Custom Message
                                                    <div
                                                        style={{
                                                            height: "10px",
                                                        }}
                                                    />
                                                    <span
                                                        style={{
                                                            marginTop: "-4px",
                                                            clear: "both",
                                                        }}
                                                    >
                                                        <textarea
                                                            className="input"
                                                            type="text"
                                                            placeholder="Click the verify button and authorize the bot to receive the **Verification Role** and access to the rest of the server."
                                                            value={
                                                                inAppCustomMessage
                                                                    ? inAppCustomMessage
                                                                    : ""
                                                            }
                                                            onChange={(value) =>
                                                                setInAppCustomMessage(
                                                                    value.target
                                                                        .value
                                                                )
                                                            }
                                                        ></textarea>
                                                    </span>
                                                </div>
                                                <div
                                                    style={{ height: "10px" }}
                                                />
                                                <div className="box-desc">
                                                    In App Custom Embed Colour
                                                    <div
                                                        style={{
                                                            height: "10px",
                                                        }}
                                                    />
                                                    <span
                                                        style={{
                                                            marginTop: "-4px",
                                                            clear: "both",
                                                        }}
                                                    >
                                                        <input
                                                            style={{
                                                                height: "50px",
                                                            }}
                                                            className="input"
                                                            type="color"
                                                            placeholder="Click the verify button and authorize the bot to receive the **Verification Role** and access to the rest of the server."
                                                            onChange={(
                                                                value
                                                            ) => {
                                                                setInAppEmbedColor(
                                                                    parseInt(
                                                                        value.target.value.replace(
                                                                            "#",
                                                                            ""
                                                                        ),
                                                                        16
                                                                    )
                                                                );
                                                            }}
                                                        ></input>
                                                    </span>
                                                </div>
                                                <div
                                                    style={{ height: "10px" }}
                                                />
                                                <div className="box-desc">
                                                    In App Custom Image
                                                    <div
                                                        style={{
                                                            height: "10px",
                                                        }}
                                                    />
                                                    <span
                                                        style={{
                                                            marginTop: "-4px",
                                                            clear: "both",
                                                        }}
                                                    >
                                                        <input
                                                            className="input"
                                                            type="text"
                                                            placeholder="https://desipher.io/desipher.png"
                                                            value={
                                                                inAppCustomImage
                                                                    ? inAppCustomImage
                                                                    : ""
                                                            }
                                                            onChange={(value) =>
                                                                setInAppCustomImage(
                                                                    value.target
                                                                        .value
                                                                )
                                                            }
                                                        ></input>
                                                    </span>
                                                </div>
                                                <div
                                                    style={{ height: "10px" }}
                                                />
                                                <div className="box-desc">
                                                    In App Custom Button Text
                                                    <div
                                                        style={{
                                                            height: "10px",
                                                        }}
                                                    />
                                                    <span
                                                        style={{
                                                            marginTop: "-4px",
                                                            clear: "both",
                                                        }}
                                                    >
                                                        <input
                                                            className="input"
                                                            type="text"
                                                            placeholder="Verify"
                                                            value={
                                                                inAppCustomButton
                                                                    ? inAppCustomButton
                                                                    : ""
                                                            }
                                                            onChange={(
                                                                value
                                                            ) => {
                                                                if (
                                                                    !value
                                                                        .nativeEvent
                                                                        .data &&
                                                                    inAppCustomButton
                                                                ) {
                                                                    return setInAppCustomButton(
                                                                        inAppCustomButton.substring(
                                                                            0,
                                                                            inAppCustomButton.length -
                                                                                1
                                                                        )
                                                                    );
                                                                }

                                                                if (
                                                                    value.target
                                                                        .value ===
                                                                    ""
                                                                ) {
                                                                    return setInAppCustomButton(
                                                                        null
                                                                    );
                                                                }

                                                                if (
                                                                    inAppCustomButton &&
                                                                    inAppCustomButton.length ===
                                                                        80
                                                                ) {
                                                                    return;
                                                                } else
                                                                    setInAppCustomButton(
                                                                        value
                                                                            .target
                                                                            .value
                                                                    );
                                                            }}
                                                        ></input>
                                                    </span>
                                                </div>
                                            </AccordionDetails>
                                        </Accordion>
                                        <div style={{ height: "10px" }} />
                                    </>
                                ) : (
                                    <></>
                                )}
                                {data.premiumLevel >= 1 && (
                                    <>
                                        <div style={{ height: "10px" }} />
                                        <div className="box-desc">
                                            VPN / Proxy Check{" "}
                                            <span
                                                style={{
                                                    float: "right",
                                                    marginTop: "-4px",
                                                    clear: "both",
                                                }}
                                            >
                                                <Switch
                                                    checked={vpnCheck}
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
                                                    onChange={(checked) => {
                                                        setVpnCheck(checked);
                                                    }}
                                                />
                                            </span>
                                        </div>
                                    </>
                                )}

                                {data.premium.level >= 2 ? (
                                    <>
                                        <div style={{ height: "10px" }} />
                                        <div className="box-desc">
                                            Custom Link
                                            <div style={{ height: "10px" }} />
                                            <span
                                                style={{
                                                    marginTop: "-4px",
                                                    clear: "both",
                                                }}
                                            >
                                                <input
                                                    className="input"
                                                    type="text"
                                                    placeholder="desipher"
                                                    value={
                                                        customLink
                                                            ? customLink
                                                            : ""
                                                    }
                                                    onChange={(value) => {
                                                        const format =
                                                            /[ `!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/;

                                                        if (
                                                            format.test(
                                                                value
                                                                    .nativeEvent
                                                                    .data
                                                            )
                                                        ) {
                                                            return;
                                                        } else {
                                                            setCustomLink(
                                                                value.target
                                                                    .value
                                                            );
                                                        }
                                                    }}
                                                ></input>
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <></>
                                )}
                                {data.premium.level === 3 ? (
                                    <>
                                        <div style={{ height: "10px" }} />
                                        <div className="box-desc">
                                            Redirect URL
                                            <div style={{ height: "10px" }} />
                                            <span
                                                style={{
                                                    marginTop: "-4px",
                                                    clear: "both",
                                                }}
                                            >
                                                <input
                                                    className="input"
                                                    type="text"
                                                    placeholder="https://discord.gg/restore"
                                                    value={
                                                        redirectUrl
                                                            ? redirectUrl
                                                            : ""
                                                    }
                                                    onChange={(value) =>
                                                        setRedirectUrl(
                                                            value.target.value
                                                        )
                                                    }
                                                ></input>
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <></>
                                )}
                                <button
                                    className="app-button"
                                    onClick={handleSave}
                                    disabled={saving}
                                >
                                    SAVE SETTINGS
                                </button>
                                <div style={{ height: "10px" }} />
                                <div className="divider" />
                                <div
                                    className="app-button"
                                    onClick={() => router.push("/help")}
                                >
                                    NEED HELP?
                                </div>
                            </div>
                        </div>
                        <div className="col dashboard_span_2_of_2">
                            <div
                                className="box"
                                style={{ marginBottom: "20px" }}
                            >
                                <div className="box-title">FAQ</div>
                                <div
                                    className="account-settings-area"
                                    style={{ display: "flex" }}
                                >
                                    <div className="user-text">
                                        <div className="user-title">
                                            What is a verification role?
                                        </div>
                                        <div className="user-desc">
                                            The verification role you have
                                            configured will be given to the user
                                            after they complete the
                                            verification.
                                        </div>
                                        <div className="user-title">
                                            What is verification for?
                                        </div>
                                        <div className="user-desc">
                                            Verification is a way for your
                                            discord server to restore members
                                            once it has been raided or nuked.
                                        </div>
                                        <div className="user-title">
                                            What is the link for verification?
                                        </div>
                                        <div className="user-desc">
                                            Your verification link is currently:
                                            https://desipher.io/verify/{id}.
                                        </div>
                                        <div className="user-title">
                                            How do i start using verification?
                                        </div>
                                        <div className="user-desc">
                                            To start using verification,
                                            configure the correct settings. Then
                                            create a channel where people can
                                            verify. You may insert your
                                            verification link there.
                                        </div>
                                        <div className="user-title">
                                            My settings aren&apos;t saving?
                                        </div>
                                        <div className="user-desc">
                                            Make sure the bot is above your
                                            verification role and has
                                            permissions to view your logging
                                            channel. If it still does not save,
                                            contact support.
                                        </div>
                                        {data.premium.level >= 2 ? (
                                            <>
                                                <div className="user-title">
                                                    What is Custom Link?
                                                </div>
                                                <div className="user-desc">
                                                    Custom Link is a way to
                                                    change your verification
                                                    link. Instead of your
                                                    verification link being:
                                                    https://desipher.io/verify/
                                                    {id}, it could be
                                                    https://desipher.io/verify/desipher.
                                                </div>
                                                <div className="user-title">
                                                    What is Server Deletion
                                                    Detection?
                                                </div>
                                                <div className="user-desc">
                                                    Server Deletion Detection is
                                                    a way for server owners to
                                                    know when their server has
                                                    been deleted. We have many
                                                    algorithms to determine if
                                                    your server has been
                                                    deleted, and if it has been
                                                    we will send an immediate
                                                    email to you.
                                                </div>
                                            </>
                                        ) : (
                                            <></>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ToastContainer
                    position="bottom-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
            </>
        );
    }

    return <Loading />;
};

export default VerificationSettings;
