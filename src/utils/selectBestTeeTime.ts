import { TeeTime } from "../models";
import { parseISO, format } from "date-fns";

const selectBestTeeTime = (teeTimes: TeeTime[]): TeeTime => {
    // const teeTime = teeTimes[0];

    // select middle tee time
    const middleIndex = Math.floor(teeTimes.length / 2);
    const middleTeeTime = teeTimes[middleIndex];

    // teeTimes.forEach(tt => {
    //     console.log(tt);
    //     const date = parseISO(tt.teetime);
    //     const displayDate = format(date, 'E MMM d h:mm a');

    //     console.log({ displayDate, teetime: tt.teetime });
    // });

    return middleTeeTime;
}

export default selectBestTeeTime;