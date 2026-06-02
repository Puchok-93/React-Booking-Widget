import { addMinutes } from "date-fns";
import type { TAvailabilitySlot } from "./types/availableSlots";

type TGeneataeSlotsParams = {
    date: Date;
    startHour?: number;
    endHour?: number;
    slotDuration?: number;
};

export function generateSlots({date, startHour = 10, endHour = 22, slotDuration = 30}: TGeneataeSlotsParams) {
    const slots: TAvailabilitySlot[] = [];
    const startDate = new Date(date);
    const endDate = new Date(date);

    startDate.setHours(startHour, 0, 0, 0);
    endDate.setHours(endHour, 0, 0, 0);

    let current = startDate;

    while(current < endDate) {
        const next = addMinutes(current, slotDuration);

        slots.push({
            timeStart: current.toISOString(),
            timeEnd: next.toISOString()
        });

        current = next;
    }

    return slots;
}