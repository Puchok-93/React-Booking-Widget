export type TAvailabilitySlot = {
    timeStart: string
    timeEnd: string
}

export type TAvailabilitySlotsResponse = {
    result:
        | 'no data'
        | TAvailabilitySlot[]
}