// Dependencies
import ora from "ora";
// import figlet from 'figlet';

// Project Files
import logger from "./utils/logger";
import config, { Courses } from "./config";
import { TeeTime } from "./models";
import { addToState } from "./utils/state";
import {
    authenticate,
    getTeeTimes,
    addReservation,
    addTeeTimeToCart,
    generateReservation,
    updateCartWithReservationId,
    deleteCartItem,
    getCart,
    createCart,
} from "./api";
import waitForTeetimes from "./utils/waitForTeetimes";
import selectBestTeeTime from "./utils/selectBestTeeTime";
import getCartId from "./utils/getCartId";
import { format, parseISO } from "date-fns";
import getCourseNameById from "./utils/getCourseNameById";
import notifyGolfers from "./utils/notifyGolfers";
import getCourseById from "./utils/getCourseById";

export const bookTeeTime = async (date: string, courses: Courses[]) => {
    const start = new Date();

    const courseIds = courses.map((course) => {
        return config.courses[course].id;
    });

    const courseNames = courses.map((course) => {
        return config.courses[course].name;
    });

    // print out a header to the console
    console.log(`
    ⛳ Golf Bot v0.1
    ----------------
    `);

    // print current time
    console.log(`Current Time: ${format(new Date(), "EEEE, MMMM do h:mm a")}`);

    console.log(
        `📅 Booking tee time for ${format(parseISO(date), "EEEE, MMMM do")}`
    );

    /**
     * Authentication
     */
    const spinner = ora("Authenticating").start();
    const { sessionToken } = await authenticate();
    addToState("sessionToken", sessionToken);
    logger({
        message: `🔑 Got session token: ${sessionToken.slice(0, 10)}...`,
        type: "info",
    });
    spinner.succeed();

    /**
     * Create a cart attached to the user
     */
    spinner.start("Getting cart id");
    const createdCart = await createCart();
    addToState("cartId", createdCart.id);
    logger({
        message: `🛒 Created shopping cart with id: ${createdCart.id}`,
        type: "info",
    });
    spinner.succeed(`Created shopping cart with id: ${createdCart.id}`);

    /**
     * Get tee times for the date
     */
    spinner.start("Getting tee times");
    logger({
        message: `📅 Getting tee times for courses: ${courseNames.join(", ")}`,
        type: "info",
    });
    // const teetimes = await getTeeTimes(courseIds, date);
    const teetimes = await waitForTeetimes(spinner, courseIds, date);

    if (teetimes === null || teetimes.length === 0) {
        throw new Error("No tee times found");
    }

    logger({
        message: `🏌️ Found ${teetimes.length} tee times.`,
        type: "info",
    });
    const bestTeeTime = selectBestTeeTime(teetimes);
    const bestTeeTimeDate = parseISO(bestTeeTime.teetime);
    spinner.succeed(`Found ${teetimes.length} tee times.`);
    spinner.succeed(
        `Selected Best Tee Time: ${format(bestTeeTimeDate, "E MMM d h:mm a")}`
    );
    logger({
        message: `🕛 Selected Best Tee Time: ${format(
            bestTeeTimeDate,
            "E MMM d h:mm a"
        )}`,
        type: "info",
    });

    // add tee time to cart
    spinner.start("Adding tee time to cart");
    const cart = await addTeeTimeToCart(bestTeeTime);
    spinner.succeed(`Added tee time to cart`);
    logger({ message: "⛳ Added tee time to cart", type: "info" });

    // create a reservation
    spinner.start("Creating reservation");
    const reservation = await generateReservation(bestTeeTime, cart);
    spinner.succeed(`Created reservation`);
    logger({
        message: `📝 Created reservation with id: ${reservation.reservation._id}`,
        type: "info",
    });

    // update cart item with reservation
    spinner.start("Updating cart item with reservation");
    await updateCartWithReservationId(
        reservation.reservation._id,
        cart.items[0]
    );
    spinner.succeed(`Updated cart item with reservation`);
    logger({ message: "🛒 Updated cart item with reservation", type: "info" });

    const totalRunTime = new Date().getTime() - start.getTime();

    // create a new reservation
    spinner.start("Booking tee time");
    // await addReservation(reservation);
    const course = getCourseById(bestTeeTime.courseId);
    spinner.stopAndPersist({
        symbol: "⛳",
        text: `Booked tee time for ${course.name} on ${format(
            bestTeeTimeDate,
            "E MMM d h:mm a"
        )}`,
    });
    logger({
        message: `⛳ Booked Tee Time! ${course.name} ${format(
            bestTeeTimeDate,
            "E MMM d h:mm a"
        )}`,
        type: "info",
    });
    logger({
        message: `That took ${(totalRunTime / 1000).toFixed(2)}s`,
        type: "info",
    });

    // delete cart item
    spinner.start("Clearing shopping cart");
    await deleteCartItem(cart.items[0].id, false);
    spinner.succeed(`Cleared shopping cart`);
    logger({ message: "🛒 Cleared cart", type: "info" });

    spinner.succeed(`Total booking time: ${totalRunTime}ms`);

    return {
        course,
        teeTime: bestTeeTime,
        totalRunTime,
    };
};

// const main = async () => {
//     bookTeeTime("2022-10-29", ["burkeLake"]);
// };

// void main();

// export default {
// 	async scheduled(
// 		controller: ScheduledController,
// 		env: Env,
// 		ctx: ExecutionContext
// 	): Promise<void> {
// 		console.log(`Hello World!`);
// 		await authenticate();
// 		console.log(`Goodbye World!`);
// 	},
// };
