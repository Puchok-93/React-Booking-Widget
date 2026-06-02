import type { TAvailabilitySlot} from "../../types/availableSlots";
import {parseISO, format} from 'date-fns';
import clsx from "clsx";

type TSlotsProps = {
    slots: TAvailabilitySlot[];
    busySlots: TAvailabilitySlot[];
    selectedSlot: TAvailabilitySlot | null;
    onSelect: (slot: TAvailabilitySlot) => void;
}

function BookingSlots({slots, busySlots, selectedSlot, onSelect}: TSlotsProps) {
    if(!slots.length) return null;

    return (
        <div className="booking-slots">
            <p className="booking-slots__title booking-title">Выберите время<span>*</span></p>
            <div className="booking-slots-list">
                {slots.map((slot) => {
                    const {timeStart} = slot;
                    const formattedTime = format(
                        parseISO(timeStart),
                        'HH:mm'
                    );
                    const isBusy = busySlots.some((busySlot) => format(parseISO(busySlot.timeStart),'HH:mm') === formattedTime);
                    const isSelected = selectedSlot?.timeStart === timeStart;

                    return (
                        <button 
                            key={timeStart}
                            type="button"
                            disabled={isBusy}

                            className={clsx("booking-slots__slot", {
                                selected: isSelected,
                                disabled: isBusy,
                            })}
                            onClick={() => onSelect(slot)}
                            >
                                {format(parseISO(timeStart),'HH:mm')}
                        </button>
                    )
                })}
            </div>
        </div>
    );
}

export default BookingSlots;