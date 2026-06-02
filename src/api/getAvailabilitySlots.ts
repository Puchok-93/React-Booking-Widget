import { apiClient } from "./client";
import type { TAvailabilitySlotsResponse } from "../types/availableSlots";

type TGetAvailabilitySlotsParams = {
    shop: string;
    date: string;
}

export async function getAvailabilitySlots(params: TGetAvailabilitySlotsParams): Promise<TAvailabilitySlotsResponse> {
    console.log(
        'GET SLOTS:',
        params
    )

    const response =
        await apiClient.post(
        '/UT11/hs/recordonline/getOrders',
        params,
        )

    return response.data
}