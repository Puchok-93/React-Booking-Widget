import { DayPicker } from "react-day-picker";
import 'react-day-picker/dist/style.css';
import {parseISO, format} from 'date-fns';
import type { TAvailabilityResponse } from "../../types/availableDates";
import { ru } from "react-day-picker/locale";

type BookingCalendarProps = {
    selectedDate: Date | undefined;
    onSelect: (
        date: Date | undefined
    ) => void
    availability: TAvailabilityResponse | null;
}

function BookingCalendar({selectedDate, onSelect, availability}: BookingCalendarProps) {
    if ( !availability) {
        return null
    }

    const availableDates = availability.result === 'no data' 
        ? [] : 
        availability.result
            .filter((item) => item.available)
            .map((item) => format( parseISO(item.date), 'yyyy-MM-dd'));

    
    return (
        <div className="booking-calendar">
            <p className="booking-dates__title booking-title">Выберите дату<span>*</span></p>
            <DayPicker
                locale={ru}
                mode="single"
                selected={selectedDate}
                onSelect={onSelect}
                disabled={[
                    { 
                        before: new Date(),
                    },
                    (date) => {
                        const formatted = format(date, 'yyyy-MM-dd');
                        return !availableDates.includes(formatted);
                    },
                    
                ]}
            />
        </div>
    );
}

export default BookingCalendar;