// Dependencies
import { formatISO, addDays } from "date-fns";

// Project
import { Course } from "./config";
import { TeeTime } from "./models";
import { bookTeeTime } from ".";
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
        // await notifyGolfers(course, teeTime, totalRunTime);
        console.log("📧 Notified golfers");
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
};

void main();
