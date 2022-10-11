// Dependencies
import Mailgun from "mailgun.js";
import formData from "form-data";
import { parseISO, format } from "date-fns";

// Project
import { TeeTime } from "../models";
import config, { Course } from "../config";
import { MailgunMessageData } from "mailgun.js/interfaces/Messages";

const mailgun = new Mailgun(formData);

const sendEmail = async (data: MailgunMessageData) => {
    const mg = mailgun.client({
        username: "api",
        key: config.mailgunKey,
    });

    const msg = await mg.messages.create("hi.dougakridge.com", data);
    return msg;
};

export const notifyGolfersOfBadNews = async () => {
    const data = {
        from: "Golf Buddy <golf@hi.dougakridge.com>",
        to: config.golfers.map((golfer) => `${golfer.phone}@txt.att.net`),
        subject: `Unable to book a teetime`,
        text: `I was unable to book a teetime for you guys. Sorry!`,
        html: ``,
    };

    return sendEmail(data);
};

const notifyGolfers = async (
    course: Course,
    teeTime: TeeTime,
    totalRunTime: number
) => {
    const bestTeeTimeDate = parseISO(teeTime.teetime);

    const data = {
        from: "Golf Buddy <golf@hi.dougakridge.com>",
        to: config.golfers.map((golfer) => `${golfer.phone}@txt.att.net`),
        subject: `Teetime is booked!`,
        text: `I booked you guys a teetime for ${course.name} on ${format(
            bestTeeTimeDate,
            "E MMM d h:mm a"
        )}. It took me ${totalRunTime / 1000} seconds to find it and book it.`,
        html: ``,
    };

    return sendEmail(data);
};

export default notifyGolfers;
