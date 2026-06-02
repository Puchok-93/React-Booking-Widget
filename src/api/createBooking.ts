import { apiClient } from "./client";

type TCreateBookingParams = {
    shop: string;
    datestart: string;
    dateend: string;
    phonenumber: string;
    comment: string;
};

export async function createBooking(params: TCreateBookingParams) {
    const response = await apiClient.post(
        '/UT11/hs/recordonline/recordOrder',
        params,
    )

    return response.data;
}