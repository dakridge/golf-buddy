// Dependencies
import axios from "axios";
import WebSocket from "ws";
import FormData from "form-data";
import querystring from "querystring";
import { readFile, writeFile } from "fs-extra";

// Project
import config from "../config";
import { getState } from "../utils/state";
import makeRequest from "../utils/makeRequest";
import generateReservationData from "../utils/generateReservationData";
import {
    GetTeeTimesResponse,
    TeeTime,
    Cart,
    CartItem,
    Reservation,
} from "../models";
import getPassword from "../utils/getPassword";

// authenticates to the teeitup api
export const authenticate = async () => {
    const email = config.email;
    const password = getPassword();

    try {
        const storedToken = await readFile("./credentials.txt", "utf8");
        return { sessionToken: storedToken };
    } catch (error) {}

    const url = "https://phx-api-be-east-1b.kenna.io/profile/authenticate";

    const response = await makeRequest<{ sessionToken: string }>(url, "POST", {
        data: {
            credentials: password,
            username: email,
            type: "basic",
        },
    });

    await writeFile("./credentials.txt", response.sessionToken);

    return {
        sessionToken: response?.sessionToken ?? null,
    };
};

export const getTeeTimes = async (courseIds: string[], dateString: string) => {
    const url = `https://phx-api-be-east-1b.kenna.io/tee-times`;
    const response = await makeRequest<GetTeeTimesResponse[]>(url, "GET", {
        params: {
            courseIds: courseIds.join(","),
            date: dateString,
        },
    });

    return response[0];
};

export const addTeeTimeToCart = async (teetime: TeeTime) => {
    const url = `https://phx-api-be-east-1b.kenna.io/shopping-cart/${getState(
        "cartId"
    )}/cart-item`;

    const data = {
        item: {
            facilityId: teetime.rates[0].golfFacilityId,
            type: "TeeTime",
            extra: {
                featuredProducts: [],
                players: 1,
                price: teetime.rates[0].greenFeeWalking / 100,
                teetime: teetime.teetime,
                rate: {
                    holes: 18,
                    name: "18 Holes",
                    rateId: teetime.rates[0].golfnow.TTTeeTimeId,
                    rateSetId: teetime.rates[0].golfnow.GolfCourseId,
                    transportation: "Walking",
                },
            },
        },
    };

    const response = await makeRequest<Cart>(url, "POST", {
        data: data,
        token: getState("sessionToken"),
    });

    return response;
};

export const updateCartWithReservationId = async (
    reservationId: string,
    cartItem: CartItem
) => {
    const url = `https://phx-api-be-east-1b.kenna.io/shopping-cart/${getState(
        "cartId"
    )}/cart-item/${cartItem.id}`;

    const data: any = {
        item: {
            ...cartItem,
        },
    };

    data.item.extra.reservationId = reservationId;

    const response = await makeRequest<Cart>(url, "PATCH", {
        data: data,
        token: getState("sessionToken"),
    });
};

export const deleteCartItem = async (
    cartItemId: string,
    removeChildren: boolean
) => {
    const url = `https://phx-api-be-east-1b.kenna.io/shopping-cart/${getState(
        "cartId"
    )}/cart-item/${cartItemId}?removeChildren=${removeChildren.toString()}`;

    const response = await makeRequest<Cart>(url, "DELETE", {
        token: getState("sessionToken"),
    });
};

export const createCart = async () => {
    const url = `https://phx-api-be-east-1b.kenna.io/shopping-cart`;

    const response = await makeRequest<Cart>(url, "POST", {
        token: getState("sessionToken"),
    });

    return response;
};

export const getCart = async (sessionToken: string) => {
    const url = `https://phx-api-be-east-1b.kenna.io/shopping-cart/${getState(
        "cartId"
    )}`;

    const response = await makeRequest<Cart>(url, "GET", {
        token: sessionToken,
    });

    return response;
};

export const addReservation = async (reservation: Reservation) => {
    const url = "https://tr.gnsvc.com/AddReservation";

    // get form data
    const formData = new URLSearchParams({
        Token: reservation.reservation.transaction.authToken,
        "TeeTime.InventoryChannelID":
            reservation.reservation.transaction.invoice.ChannelId,
        "TeeTime.FacilityID":
            reservation.reservation.teetimes[0].rate.golfnow.GolfFacilityId.toString(),
        "TeeTime.TeeTimeRateID":
            reservation.reservation.teetimes[0].rate.golfnow.TTTeeTimeId.toString(),
        "TeeTime.PlayerCount": reservation.reservation.totalPlayers.toString(),
        "TeeTime.Amount": "-1",
        "TeeTime.ReferenceID":
            reservation.reservation.transaction.invoice.ReferenceId,
        "Reservation.CustomerEmail": config.email,
        SelectedCourses:
            reservation.reservation.teetimes[0].rate.golfnow.GolfFacilityId.toString(),
        ENGINE: "5.0",
        ALIAS: "fairfax-county-mco",
        "Reservation.TrackingCode": `TL:${reservation.reservation._id}`,
        "tl.holes":
            reservation.reservation.transaction.invoice.HoleCount.toString(),
        EmailCampaignId: "",
        PaymentReturnURL:
            "https://fairfax-county-mco.book.teeitup.golf/payment-authorization",
        "Payment.Name": config.name,
        "Payment.Address.Line1": "",
        "Payment.Address.PostalCode": "",
        "Payment.Address.Country": "",
        "tl.customerMobile": config.phone,
        "Payment.PhoneNumber": config.phone,
    });

    const response = await makeRequest<Reservation>(url, "POST", {
        data: formData,
        overrideHeaders: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });

    const successfulBooking =
        response.StatusCode === 200 &&
        response.PaymentStatus === "Processed" &&
        response.Success === true;

    if (successfulBooking) {
        return response;
    } else {
        console.log("RESERVATION RESPONSE: ", response);
        throw new Error("Failed to add reservation");
    }
};

export const generateReservation = async (
    teeTime: TeeTime,
    cart: Cart
): Promise<Reservation> => {
    return new Promise((resolve, reject) => {
        const ws = new WebSocket(
            "wss://fairfax-county-mco.book.teeitup.golf/socket.io/?EIO=3&transport=websocket"
        );

        ws.addEventListener("open", () => {
            // create a reservation
            const message = generateReservationData({
                courseId: teeTime.courseId,
                teeTime: teeTime.teetime,
                rateId: teeTime.rates[0].golfnow.TTTeeTimeId,
                cartId: cart.id,
                cartItemId: cart.items[0].id,
                golfersCount: cart.items[0].extra.players,
                token: getState("sessionToken"),
            });

            ws.send(message);
        });

        ws.addEventListener("message", (event) => {
            if (
                typeof event.data === "string" &&
                event.data.startsWith("437")
            ) {
                const data = JSON.parse(event.data.slice(3));
                resolve(data[0]);
            }
        });
    });
};
