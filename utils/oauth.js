export const handleOauthLogin = (
    url,
    options = { url: "https://desipher.io" }
) => {
    window.location.href = `${url}?redirect=${encodeURIComponent(options.url)}`;
};
