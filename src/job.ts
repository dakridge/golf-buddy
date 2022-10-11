// Dependencies
import { formatISO, addDays } from "date-fns";

// Project
import { bookTeeTime } from ".";
import config, { Course } from "./config";
import notifyGolfers, { notifyGolfersOfBadNews } from "./utils/notifyGolfers";

const clearConsole = () => {
    process.stdout.write("\x1Bc");
};

const main = async () => {
    clearConsole();
    console.log("Starting up...");
    const bookingDate = addDays(new Date(), 5);

    let notifiedGolfers = false;

    try {
        // book tee time
        const { course, teeTime, totalRunTime } = await bookTeeTime(
            formatISO(bookingDate, { representation: "date" }),
            ["burkeLake"]
        );

        // notify golfers
        await notifyGolfers(course, teeTime, totalRunTime);
        console.log(`📧 Notified ${config.golfers.length} golfers`);
        notifiedGolfers = true;
    } catch (error) {
        // pass
    }

    try {
        if (!notifiedGolfers) {
            await notifyGolfersOfBadNews();
        }
    } catch (error) {
        console.log(error);
    }

    console.log("Done!");
    process.exit(0);
};

void main();
