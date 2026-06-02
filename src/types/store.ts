export type TStore = {
    store_id: string;
    store_code: string;
    name: string;
    active: boolean;
}

export type TStores = TStore[];


export type TStoresResponse = {
    success: boolean
    data: TStores
    meta: {
        count: number
    }
}