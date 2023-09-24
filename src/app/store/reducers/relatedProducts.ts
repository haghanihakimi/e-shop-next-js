import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'


export interface RelatedProductsState {
    relatedProducts: Array<any>,
}

const initialState: RelatedProductsState = {
    relatedProducts: [],
}

export const RelatedProductsSlice = createSlice({
    name: 'RelatedProducts',
    initialState,
    reducers: {
        setRelatedProducts: (state, action: PayloadAction<Array<any>>) => {
            state.relatedProducts = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const {
    setRelatedProducts,
} = RelatedProductsSlice.actions

export default RelatedProductsSlice.reducer