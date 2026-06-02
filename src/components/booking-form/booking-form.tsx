import BookingStores from "../booking-stores/booking-stores";
import BookingCalendar from "../booking-calendar/booking-calendar";
import BookingSlots from "../booking-slots/booking-slots";
import CustomPhoneField from "../custom-fields/custom-phone-field";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { STORES } from "../../const";
import type { TAvailabilitySlot } from "../../types/availableSlots";
import type { TStore } from "../../types/store";
import type { TBookingFormValues } from "../../types/user";
import type { TAvailabilityResponse } from "../../types/availableDates";
import {addDays, format} from 'date-fns';
import { getAvailabilityDate } from "../../api/getAvailabilityDate";
import { getAvailabilitySlots } from "../../api/getAvailabilitySlots";
import { generateSlots } from "../../utils";
import { createBooking } from "../../api/createBooking";

function BookingForm() {
    const [selectedStore, setSelectedStore] = useState<TStore | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [selectedSlot, setSelectedSlot] = useState<TAvailabilitySlot | null>(null);
    const [availability, setAvailability] = useState<TAvailabilityResponse | null>(null);
    const [busySlots, setBusySlots] = useState<TAvailabilitySlot[]>([]);
    const [bookingStatus, setBookingStatus] = useState<{type: 'success' | 'error'; message: string} | null>(null);

    async function handleStoreSelect(store: TStore) {
        try {
            setSelectedStore(store); // Выбираем магазин
            setSelectedSlot(null);

            /* если дата уже выбрана — перезапрашиваем busy slots
            */
            if (selectedDate) {
                const slotsResponse =
                    await getAvailabilitySlots(
                        {
                        shop: store.store_id,
                        date: format(selectedDate,"yyyy-MM-dd'T'00:00:00")
                    })

                /*
                    no data
                */
                if (slotsResponse.result === 'no data') {
                    setBusySlots([])
                    return
                }

                /* обновляем busy slots */
                setBusySlots(
                    slotsResponse.result
                )

                return
            }

            const toDay = new Date(); // Сегодня
            const dateAfter30Days = addDays(toDay, 30); // Сегодня + 30дней
            const response = await getAvailabilityDate(
                {
                    shop: store.store_id,
                    dateStart: format(toDay, "yyyy-MM-dd'T'00:00:00"),
                    dateEnd: format(dateAfter30Days, "yyyy-MM-dd'T'00:00:00"),
                }
            );
            setAvailability(response);


        } catch(error) {
            console.log(error)
        }
    };

    async function handleDateSelect( date: Date | undefined) {
        if(!date) return;
        if(!selectedStore) return;

        try {
            setSelectedSlot(null);
            setSelectedDate(date);

            const response = await getAvailabilitySlots({
                shop: selectedStore.store_id,
                date: format(date, "yyyy-MM-dd'T'00:00:00"),
            });

            if (
                response.result ===
                'no data'
                ) {
                setBusySlots([])

                return
            }

            console.log('SLOTS:', response);
            setBusySlots(response.result)
        } catch {
            console.log('error')
        }
    }

    const allSlots = selectedDate ? generateSlots({date: selectedDate}) : [];

    const { register, handleSubmit, setValue, watch} = useForm<TBookingFormValues>();

    const agreement = watch('agreement', false);

    const onSubmit = async (values: TBookingFormValues) => {

        if(!selectedStore) return;
        if(!selectedSlot) return;

        try {
            const payload = {
                shop: selectedStore.store_id,
                datestart: selectedSlot.timeStart,
                dateend: selectedSlot.timeEnd,
                phonenumber: values.phone,
                comment:   values.name,
            };

            const response = await createBooking(payload);

            if(response.result === 'success') {
                setBookingStatus({
                    type: 'success',
                    message: 'Вы успешно записаны',
                });

                if(!selectedDate) {
                    return;
                }

                const slotResponse = await getAvailabilitySlots({
                    shop: selectedStore.store_id,
                    date: format(selectedDate, "yyyy-MM-dd'T'00:00:00")
                })

                if(slotResponse.result === 'no data') {
                    setBusySlots([]);
                } else {
                    setBusySlots(slotResponse.result);
                }

                return
            }

            setBookingStatus({
                type: 'error',
                message: response.reason ?? 'Не удалось создать запись',
            })

        } catch (error) {
            console.error(error);
            setBookingStatus({
                type: 'error',
                message: 'Ошибка соединения',
            })
        }

    }
    
    return (
        <form className="booking-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="booking-layout booking-layout--grid">
                <div className="booking-form-field">
                    <label className="booking-form-field__label" htmlFor="user-name">
                        Укажите ваше имя и фамилию<span>*</span>
                    </label>
                    <input 
                        id="user-name" 
                        className="booking-form-field__input" 
                        type="text" 
                        placeholder=""
                        {...register('name')}
                    />
                </div>
                <div className="booking-form-field">
                    <label htmlFor="user-phone">Укажите ваш номер телефона<span>*</span></label>
                    <CustomPhoneField setValue={setValue}/>
                </div>
            </div>
            <BookingStores 
                stores={STORES}
                selectedStore={selectedStore}
                onSelect={handleStoreSelect}
            />
            <div className="booking-layout">
                <>
                    <BookingCalendar 
                        selectedDate={selectedDate}
                        onSelect={handleDateSelect}
                        availability={availability}
                    />
                    <BookingSlots 
                        slots={allSlots}
                        busySlots={busySlots}
                        selectedSlot={selectedSlot}
                        onSelect={setSelectedSlot}
                    />
                </>
            </div>
            <div className="agreement">
                <div className="agreement-input-block">
                    <input 
                        className="visually-hidden" 
                        type="checkbox" 
                        data-validate-field="checkbox_required" 
                        id="booking-create-agreement" 
                        {...register('agreement', {required: true})}
                        />
                    <label htmlFor="booking-create-agreement"></label>
                </div>
                <a 
                    target="_blank" 
                    href="/documents/politika-konfidentsialnosti/">Согласие на обработку персональных данных
                </a>
            </div>
            { bookingStatus && (
                <div className={`booking-message booking-message--${bookingStatus?.type}`}>
                    {bookingStatus.message}
                </div>
            )}
            <button 
                className="booking-form__submit-btn" 
                type="submit"
                disabled={!agreement}>
                    Отправить
            </button>
        </form>
    
    );
};

export default BookingForm;