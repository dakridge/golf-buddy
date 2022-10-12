// Dependencies
import { formatISO, addDays, format } from "date-fns";

// Project
import bookTeeTime from "./bookTeeTime";
import config, { Courses } from "./config";
import notifyGolfers, { notifyGolfersOfBadNews } from "./utils/notifyGolfers";

const clearConsole = () => {
    process.stdout.write("\x1Bc");
};

const bookTeeTimeWrapper = async (bookingDate: Date, courses: Courses[]) => {
    try {
        // book tee time
        const { course, teeTime, totalRunTime } = await bookTeeTime(
            formatISO(bookingDate, { representation: "date" }),
            courses
        );

        return {
            course,
            teeTime,
            totalRunTime,
        };
    } catch (error) {
        // pass
    }

    throw new Error("Could not book tee time");
};

const main = async () => {
    clearConsole();
    console.log("Starting up...");
    const bookingDate = addDays(new Date(), 8);

    const days = process.env.DAYS?.split(",") as string[];
    const courses = process.env.COURSES?.split(",") as Courses[];

    const bookingDay = format(bookingDate, "EEEE").toUpperCase();

    // if booking date is not in the list of days, exit
    if (!days.includes(bookingDay)) {
        console.log(
            `Not a valid day to book. You can only book on ${days} but you are trying to book on ${bookingDay}.`
        );
        return;
    }

    let notifiedGolfers = false;
    let course: any = null;
    let teeTime: any = null;
    let totalRunTime: any = null;

    try {
        // book tee time
        const data = await bookTeeTimeWrapper(bookingDate, courses);

        course = data.course;
        teeTime = data.teeTime;
        totalRunTime = data.totalRunTime;

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

    return {
        course,
        teeTime,
        "totalRunTime (ms)": totalRunTime,
    };
};

export default main;
