import DatabaseClient from "../lib/mongoose";

export const checkConnection = async () => {
    if (!DatabaseClient.connected && !DatabaseClient.connecting) {
        await DatabaseClient.connect();
        return true;
    } else {
        return true;
    }
};
