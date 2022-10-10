"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Dependencies
const ora_1 = __importDefault(require("ora"));
// import figlet from 'figlet';
// Project Files
const logger_1 = __importDefault(require("./utils/logger"));
const config_1 = __importDefault(require("./config"));
const state_1 = require("./utils/state");
const api_1 = require("./api");
const selectBestTeeTime_1 = __importDefault(require("./utils/selectBestTeeTime"));
const date_fns_1 = require("date-fns");
const notifyGolfers_1 = __importDefault(require("./utils/notifyGolfers"));
const getCourseById_1 = __importDefault(require("./utils/getCourseById"));
const bookTeeTime = (date, courses) => __awaiter(void 0, void 0, void 0, function* () {
    const start = new Date();
    const courseIds = courses.map(course => {
        return config_1.default.courses[course].id;
    });
    const courseNames = courses.map(course => {
        return config_1.default.courses[course].name;
    });
    // print out a header to the console
    console.log(`
    ⛳ Golf Bot v0.1
    ----------------
    `);
    const spinner = (0, ora_1.default)('Authenticating').start();
    const { sessionToken } = yield (0, api_1.authenticate)();
    (0, state_1.addToState)('sessionToken', sessionToken);
    (0, logger_1.default)({ message: `🔑 Got session token: ${sessionToken.slice(0, 10)}...`, type: 'info' });
    spinner.succeed();
    spinner.start('Getting cart id');
    const createdCart = yield (0, api_1.createCart)();
    (0, state_1.addToState)('cartId', createdCart.id);
    (0, logger_1.default)({ message: `🛒 Created shopping cart with id: ${createdCart.id}`, type: 'info' });
    spinner.succeed(`Created shopping cart with id: ${createdCart.id}`);
    spinner.start('Getting tee times');
    (0, logger_1.default)({ message: `📅 Getting tee times for courses: ${courseNames.join(', ')}`, type: 'info' });
    const teetimes = yield (0, api_1.getTeeTimes)(courseIds, date);
    (0, logger_1.default)({ message: `🏌️ Found ${teetimes.teetimes.length} tee times.`, type: 'info' });
    const bestTeeTime = (0, selectBestTeeTime_1.default)(teetimes.teetimes);
    const bestTeeTimeDate = (0, date_fns_1.parseISO)(bestTeeTime.teetime);
    spinner.succeed(`Found ${teetimes.teetimes.length} tee times.`);
    spinner.succeed(`Selected Best Tee Time: ${(0, date_fns_1.format)(bestTeeTimeDate, 'E MMM d h:mm a')}`);
    (0, logger_1.default)({ message: `🕛 Selected Best Tee Time: ${(0, date_fns_1.format)(bestTeeTimeDate, 'E MMM d h:mm a')}`, type: 'info' });
    // add tee time to cart
    spinner.start('Adding tee time to cart');
    const cart = yield (0, api_1.addTeeTimeToCart)(bestTeeTime);
    spinner.succeed(`Added tee time to cart`);
    (0, logger_1.default)({ message: '⛳ Added tee time to cart', type: 'info' });
    // create a reservation
    spinner.start('Creating reservation');
    const reservation = yield (0, api_1.generateReservation)(bestTeeTime, cart);
    spinner.succeed(`Created reservation`);
    (0, logger_1.default)({ message: `📝 Created reservation with id: ${reservation.reservation._id}`, type: 'info' });
    // update cart item with reservation
    spinner.start('Updating cart item with reservation');
    yield (0, api_1.updateCartWithReservationId)(reservation.reservation._id, cart.items[0]);
    spinner.succeed(`Updated cart item with reservation`);
    (0, logger_1.default)({ message: '🛒 Updated cart item with reservation', type: 'info' });
    const totalRunTime = new Date().getTime() - start.getTime();
    // create a new reservation
    spinner.start('Booking tee time');
    yield (0, api_1.addReservation)(reservation);
    const course = (0, getCourseById_1.default)(bestTeeTime.courseId);
    spinner.stopAndPersist({
        symbol: '⛳',
        text: `Booked tee time for ${course.name} on ${(0, date_fns_1.format)(bestTeeTimeDate, 'E MMM d h:mm a')}`
    });
    (0, logger_1.default)({ message: `⛳ Booked Tee Time! ${course.name} ${(0, date_fns_1.format)(bestTeeTimeDate, 'E MMM d h:mm a')}`, type: 'info' });
    (0, logger_1.default)({ message: `That took ${(totalRunTime / 1000).toFixed(2)}s`, type: 'info' });
    // delete cart item
    spinner.start('Clearing shopping cart');
    yield (0, api_1.deleteCartItem)(cart.items[0].id, false);
    spinner.succeed(`Cleared shopping cart`);
    (0, logger_1.default)({ message: '🛒 Cleared cart', type: 'info' });
    // notify golfers
    spinner.start('Notifying golfers');
    yield (0, notifyGolfers_1.default)(course, bestTeeTime);
    spinner.succeed(`Notified golfers`);
    (0, logger_1.default)({ message: '📧 Notified golfers', type: 'info' });
    spinner.succeed(`Total booking time: ${totalRunTime}ms`);
});
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    bookTeeTime("2022-10-13", [
        "burkeLake",
    ]);
});
void main();
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
