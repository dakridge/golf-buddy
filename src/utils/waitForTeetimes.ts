// Dependencies
import ora from "ora";

// Project
import { TeeTime } from "../models";
import { getTeeTimes } from "../api";

const waitForTeetimes = async (
    spinner: ora.Ora,
    courseIds: string[],
    date: string
) => {
    const MAX_ATTEMPTS = 30;

    let tries = 0;
    let teetimes: TeeTime[] | null = null;

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

        await new Promise((resolve) => setTimeout(resolve, 5000));
        tries++;
    }

    // resolve(teetimes);
    return teetimes;
};

export default waitForTeetimes;
