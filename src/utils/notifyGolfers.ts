// Dependencies
import Mailgun from 'mailgun.js';
import formData from 'form-data';
import { parseISO, format } from 'date-fns';

// Project
import { TeeTime } from '../models';
import config, { Course } from '../config';


const mailgun = new Mailgun(formData);

const notifyGolfers = async (course: Course, teeTime: TeeTime) => {
    const bestTeeTimeDate = parseISO(teeTime.teetime);

    const mg = mailgun.client({
        username: 'api', 
        key: config.mailgunKey,
    });

    const data = {
        from: 'Golf Buddy <golf@hi.dougakridge.com>',
        to: config.golfers.map((golfer) => `${golfer.phone}@txt.att.net`),
        subject: `Teetime is booked!`,
        text: `I booked you guys a teetime for ${course.name} on ${format(bestTeeTimeDate, 'E MMM d h:mm a')}`,
        html: ``,
    };

    const msg = await mg.messages.create('hi.dougakridge.com', data);
    return msg;
};

export default notifyGolfers;