export function apiRequest({
    method = "GET",
    path,
    data,
    token,
    headers = {},
}) {
    return fetch(path, {
        method: method,
        headers: {
            "Content-Type": "application/json",
            Authorization: token,
            ...headers,
        },
        body: JSON.stringify(data),
    });
}

export default apiRequest;
