class Sellix {
    token = null;

    constructor({
        token,
        options = {
            prefix: "Bearer",
        },
    }) {
        this.token = token;
    }

    fetchOrder(orderId) {}
}
