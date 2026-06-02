import { apiClient } from './client'

type TGetAvailabilityDateParams = {
  shop: string
  dateStart: string
  dateEnd: string
}

export async function getAvailabilityDate(params: TGetAvailabilityDateParams) {
  console.log('SEND TO API:', params)

  const response = await apiClient.post(
    '/UT11/hs/recordonline/getDates',
    params
  )

  return response.data
}
