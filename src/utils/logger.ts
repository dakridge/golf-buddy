const logger = (log: { message: string; type: "info" | "error" }) => {
    if (log.type === "info") {
        // console.log(log.message);
    } else {
        console.error(log.message);
    }
};

export default logger;
