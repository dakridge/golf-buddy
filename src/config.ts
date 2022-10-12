export interface Course {
    id: string;
    name: string;
    shortId: number;
}

interface Golfer {
    name: string;
    email: string;
    phone: string;
}

export type Courses = "TWIN_LAKES" | "LAUREL_HILL" | "GREENDALE" | "BURKE_LAKE";

interface Config {
    name: string;
    phone: string;
    email: string;
    shoppingCartId: string;
    mailgunKey: string;
    golfers: Golfer[];
    courses: Record<Courses, Course>;
}

const config: Config = {
    name: "Robert Newman",
    phone: "12025737180",
    email: "electricrocket@protonmail.com",
    shoppingCartId: "419372de-de17-4c50-b373-22c366f0fc9f",
    mailgunKey: "key-8vykq367mkengx2pluy-hcjv5qrfy4i5",

    golfers: [
        {
            name: "Doug Akridge",
            email: "doug.a.akridge@gmail.com",
            phone: "7036552880",
        },
        {
            name: "Curtis Mason",
            email: "cgmasonii@gmail.com",
            phone: "7034779271",
        },
    ],

    courses: {
        TWIN_LAKES: {
            name: "Twin Lakes",
            shortId: 4595,
            id: "5e3d7968ce07ad0100ad93d0",
        },
        LAUREL_HILL: {
            name: "Laurel Hill",
            shortId: 4596,
            id: "54f14cf20c8ad60378b03119",
        },
        GREENDALE: {
            name: "Greendale",
            shortId: 4597,
            id: "54f14e530c8ad60378b04dad",
        },
        BURKE_LAKE: {
            name: "Burke Lake",
            shortId: 4598,
            id: "5e43088775a12b0100190df2",
        },
    },
};

export default config;
