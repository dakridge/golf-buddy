import config from "../../config";
import { TeeTime } from "../../models";
import {
    parseISO,
    getHours,
    differenceInMinutes,
    setHours,
    setMinutes,
    format,
} from "date-fns";

const selectBestTeeTime = (teeTimes: TeeTime[]): TeeTime => {
    const EARLY_TEE_TIME = 9;

    let scoredTeeTimes = teeTimes.map((teeTime) => {
        const date = parseISO(teeTime.teetime);
        const earlyCutOff = setMinutes(setHours(date, EARLY_TEE_TIME), 0);
        const availableSpots = teeTime.maxPlayers;
        // const isEarlyTime = getHours(date) < EARLY_TEE_TIME;

        const timeDelta = differenceInMinutes(earlyCutOff, date);

        // score tee time
        let score = 0;

        // calculate the available spots score
        const availableSpotsScore =
            (availableSpots - (config.golfers.length - 1)) * 100;
        score += availableSpotsScore;

        // calculate the time delta score
        let earlyCutoffScore = 0;

        if (date < earlyCutOff) {
            earlyCutoffScore = 400 + timeDelta;
        }

        score += earlyCutoffScore;

        const meta = {
            time: format(date, "h:mm a"),
            date,
            availableSpots,
            earlyCutOff,
            isEarlyTime: date < earlyCutOff,
            score,
            timeDelta,
            scores: {
                earlyCutoffScore,
                availableSpotsScore,
            },
        };

        return {
            ...teeTime,
            meta,
        };
    });

    // remove tee times that don't have enough spots
    scoredTeeTimes = scoredTeeTimes.filter((teeTime) => {
        return teeTime.meta.availableSpots >= config.golfers.length;
    });

    // sort tee times by score
    scoredTeeTimes = scoredTeeTimes.sort((a, b) => {
        return b.meta.score - a.meta.score;
    });

    if (scoredTeeTimes.length === 0) {
        throw new Error("No tee times found");
    }

    return scoredTeeTimes[0];
};

export default selectBestTeeTime;
