import type { TStore, TStores } from "../../types/store";

type TStoresProps = {
    selectedStore: TStore | null;
    onSelect: (store: TStore) => void;
    stores: TStores;
}

function BookingStores({selectedStore, onSelect, stores}: TStoresProps) {
    return(
        <div className="booking-stores">
            <p className="booking-stores__title booking-title">Выберите магазин<span>*</span></p>
            <div className="booking-stores-list">
                {
                    stores.map((store) => {
                            const { store_id, store_code, name, active } = store;
                            return (
                                <div key={store_id} className="booking-store">
                                    <input 
                                        id={store_id}
                                        className="booking-store__input visually-hidden "
                                        type="radio"
                                        name="store"
                                        value={store_code}
                                        checked={selectedStore === store}
                                        disabled={!active}
                                        onChange={() => onSelect(store)}
                                    />
                                    <label 
                                        htmlFor={store_id}
                                        className="booking-store__label"
                                        >
                                        {name}
                                    </label>
                                </div>
                            )
                        }
                    )
                }
            </div>
        </div>
    );
};

export default BookingStores;