export interface TeeTime {
    courseId: string;
    teetime: string;
    backNine: boolean;
    players: any[];
    rates: {
        _id: number;
        name: string;
        externalId: string;
        allowedPlayers: number[];
        holes: number;
        golfFacilityId: number;
        rateId: number;
        greenFeeWalking: number;
        golfnow: {
            TTTeeTimeId: number;
            GolfFacilityId: number;
            GolfCourseId: number;
        };
    }[];
    bookedPlayers: number;
    minPlayers: number;
    maxPlayers: number;
}

export interface GetTeeTimesResponse {
    dayInfo: {
        dawn: string;
        sunrise: string;
        sunset: string;
        dusk: string;
    },
    courseId: string;
    message?: string;
    teetimes: TeeTime[];
    totalAvailableTeetimes: number;
}

export interface CartItem {
    id: string;
    facilityId: number;
    type: "TeeTime";
    extra: {
        slots: {
            customerId: string | null;
            id: string;
            name: "booker" | null;
        }[];
        featuredProducts: any[];
        players: number;
        price: number;
        teetime: string;
        rate: {
            holes: number;
            name: string;
            rateId: number;
            rateSetId: number;
            transportation: 'Walking' | 'Riding';
        };
    };
}

export interface Cart {
    alias: string;
    id: string;
    items: CartItem[];
}

export interface Reservation {
    error: string | null;
    message: 'success' | 'error';
    reservation: {
        caddy: {
            type: string;
        },
        _id: string; // Reservation.TrackingCode - TL:{_id}
        courseId: string;
        teetimes: {
            playerId: string;
            rate: {
                _id: number; // TeeTimeRateID
                name: string;
                externalId: string;
                golfnow: {
                    TTTeeTimeId: number; // TeeTime.TeeTimeRateID
                    GolfFacilityId: number; // TeeTime.FacilityID, SelectedCourses
                    GolfCourseId: number;
                };
            };
            teetimeId: string;
            time: string;
            teetime: number;
        }[];
        expires: string;
        totalPlayers: number;
        transaction: {
            authToken: string; // Token
            invoice: {
                FacilityID: number;
                Time: string;
                TeeTimeRateID: number;
                RateName: string;
                PlayerCount: number;
                Pricing: {
                    DueAtCourse: {
                        CurrencyCode: string;
                        Value: number;
                    }
                };
                HoleCount: number;
                DueAtCourse: {
                    Summary: {
                        Total: number;
                    }
                };
                ReferenceId: string; // TeeTime.ReferenceID
                ChannelId: string; // TeeTime.InventoryChannelID
            };
        };
        createdAt: number;
        course: {
            id: string;
            golfFacilityId: string;
            alias: string;
            name: string;
            settings: {
                enabledRates: { GolfFacilityID: number; GolfCourseID: number; }[]
            };
        };
        
    }
}

export interface Reservation {
    ReservationStatusID: number;
    StatusCode: number;
    PaymentStatus: "Processed" | "Pending";
    RedirectUrl: null;
    Success: boolean;
    Message: string;
    ValidationErrors: any[];
}