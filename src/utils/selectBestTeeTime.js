"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const selectBestTeeTime = (teeTimes) => {
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
};
exports.default = selectBestTeeTime;
