import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface FavoritesState {
    favorites: Array<any>,
    updatingFavs: boolean,
}

const initialState: FavoritesState = {
    favorites: [],
    updatingFavs: false,
}

export const FavoritesSlice = createSlice({
    name: 'Favorites',
    initialState,
    reducers: {
        fillFavorites: (state, action: PayloadAction<any>) => {
            if (state.favorites.length <= 0) {
                state.favorites = action.payload
            }
        },
        updateFavoritesList: (state, action: PayloadAction<any>) => {
            const itemIndex = state.favorites.findIndex((item) => item?.products.id === action.payload.productId);

            if (itemIndex === -1) {
                state.favorites.push(action.payload.product);
            } else {
                state.favorites.splice(itemIndex, 1);
            }
        },
        setUpdatingFavs: (state, action: PayloadAction<any>) => {
            state.updatingFavs = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const {
    fillFavorites,
    updateFavoritesList,
    setUpdatingFavs,
} = FavoritesSlice.actions

export default FavoritesSlice.reducer