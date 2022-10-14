// Dependencies
import ora from "ora";
import { setHours, setMinutes, setSeconds, startOfMinute } from "date-fns";

// Project
import { TeeTime } from "../models";
import { getTeeTimes } from "../api";

const waitUntilTime = (time: Date) => {
    return new Promise(async (resolve) => {
        let now = new Date();

        while (now < time) {
            await new Promise((resolve) => setTimeout(resolve, 5000));
            now = new Date();
            console.log("try again ", now);
        }

        resolve(true);
    });
};

const waitForTeetimes = async (
    spinner: ora.Ora,
    courseIds: string[],
    date: string
) => {
    const INTERVAL_SECONDS = 1;
    const POLLING_TIME_MINUTES = 10; // number of minutes to poll for teetimes
    const MAX_ATTEMPTS = (60 / INTERVAL_SECONDS) * POLLING_TIME_MINUTES;

    let tries = 0;
    let teetimes: TeeTime[] | null = null;

    // don't start polling for teetimes until it is 8:59pm
    const startPollingTime = startOfMinute(
        setMinutes(setHours(new Date(), 20), 59)
    );
    console.log(startPollingTime);
    await waitUntilTime(startPollingTime);

    while (teetimes === null) {
        spinner.start(`Getting tee times (Attempt ${tries + 1})`);
        const response = await getTeeTimes(courseIds, date);

        if (response?.teetimes?.length > 0) {
            teetimes = response.teetimes;
            break;
        }

        if (tries >= MAX_ATTEMPTS) {
            spinner.fail("Could not find any tee times");
            break;
        }

        await new Promise((resolve) =>
            setTimeout(resolve, INTERVAL_SECONDS * 1000)
        );
        tries++;
    }

    // resolve(teetimes);
    return teetimes;
};

export default waitForTeetimes;
