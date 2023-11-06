import Head from "next/head";
import Script from "next/script";

const BackupViewerHeadTag = ({
    title = "Desipher",
    description = "The Recovery Of Discord Servers.",
    image = "/logo.png",
}) => {
    return (
        <Head>
            <meta httpEquiv="content-type" content="text/html;charset=UTF-8" />
            <link
                href="/logo.png"
                rel="shortcut icon"
                type="image/png"
            />
            <link href="/assets/css/discord.css" rel="stylesheet" />
            <meta name="theme-color" content="#2955B0" />
            <meta name="description" content="Desipher Backups" />
            <meta property="og:title" content="Desipher Backups" />
            <meta property="og:url" content="https://desipher.io/" />
            <meta property="og:image" content={image} />
            <meta itemProp="image" content={image} />
            <meta property="og:description" content={description} />
            <title>{title}</title>
            <meta charSet="utf-8" />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1"
            />
        </Head>
    );
};

export default BackupViewerHeadTag;
