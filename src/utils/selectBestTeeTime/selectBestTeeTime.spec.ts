// Dependencies
import { assert, expect, test } from "vitest";

// Project
import selectBestTeeTime from "./";
import { TeeTime } from "../../models";

test("a twosome at 8:59 is better than a foursome at 9:01", () => {
    const input = [
        {
            teetime: "2022-10-16T13:01:00.000Z",
            maxPlayers: 4,
        },
        {
            teetime: "2022-10-16T12:59:00.000Z",
            maxPlayers: 2,
        },
    ];

    const bestTeeTime = selectBestTeeTime(input as TeeTime[]);
    expect(bestTeeTime.maxPlayers).toEqual(2);
});

test("a threesome at 8:59 is better than a foursome at 9:01", () => {
    const input = [
        {
            teetime: "2022-10-16T13:01:00.000Z",
            maxPlayers: 4,
        },
        {
            teetime: "2022-10-16T12:59:00.000Z",
            maxPlayers: 3,
        },
    ];

    const bestTeeTime = selectBestTeeTime(input as TeeTime[]);
    expect(bestTeeTime.maxPlayers).toEqual(3);
});

test("a foursome at 9:02 is better than a threesome at 9:01", () => {
    const input = [
        {
            teetime: "2022-10-16T13:02:00.000Z",
            maxPlayers: 4,
        },
        {
            teetime: "2022-10-16T13:01:00.000Z",
            maxPlayers: 3,
        },
    ];

    const bestTeeTime = selectBestTeeTime(input as TeeTime[]);
    expect(bestTeeTime.maxPlayers).toEqual(4);
});
