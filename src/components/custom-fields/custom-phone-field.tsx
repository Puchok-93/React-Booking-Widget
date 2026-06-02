import { IMaskInput } from "react-imask"
import type { UseFormSetValue } from 'react-hook-form'
import type { TBookingFormValues } from '../../types/user'

type Props = {
    setValue: UseFormSetValue<TBookingFormValues>
}

function CustomPhoneField({setValue}: Props) {
    return (
        <IMaskInput
            id="user-phone"
            mask="+7 (000) 000 - 00 - 00"
            lazy={false}
            placeholder=""
            onAccept={(value) =>
            setValue('phone', value)
            }
        />
    )
}

export default CustomPhoneField;