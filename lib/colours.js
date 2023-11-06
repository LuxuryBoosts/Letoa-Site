const Colours = {
    DANGER: (text, options = { RESET: true }) => {
        console.log(`\x1b[31m${text}${options.RESET ? "\x1b[0m" : ""}`);
    },
};

module.exports = Colours;
