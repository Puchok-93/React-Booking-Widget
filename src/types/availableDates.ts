export type TAvailabilityDatesRange = {
    store_id: string;
    date_from: string;
    date_to: string;
}

export type TAvailableDate = {
    date: string;
    available: boolean;
    free_slots_count: number;
    reason_code?: string;
}

export type TAvailabilityResponse = {
    result: 
    | 'no data' 
    | TAvailableDate[];
}