import { formatISO, addMinutes } from "date-fns";


interface Reservation {
    courseId: string;
    teeTime: string;
    rateId: number;
    cartId: string;
    cartItemId: string;
    golfersCount: number;
    token: string;
}

const generateReservationData = (reservation: Reservation) => {
    const data = {
        courseId: reservation.courseId,
        teetime: reservation.teeTime,
        rateId: reservation.rateId,
        cartId: reservation.cartId,
        cartItemId: reservation.cartItemId,
        tags: "ONLINE",
        golferQuantity: reservation.golfersCount,
        alias:" fairfax-county-mco",
        ttl: formatISO(addMinutes(new Date(), 5)),
        sessionToken: reservation.token,
    };

    return `427["createReservation", ${JSON.stringify(data)}]`;
};

export default generateReservationData;