import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface BrandsState {
    brands: Array<any>,
}

const initialState: BrandsState = {
    brands: [],
}

export const BrandsSlice = createSlice({
    name: 'Brands',
    initialState,
    reducers: {
        setBrands: (state, action: PayloadAction<string>) => {
        },
    },
})

// Action creators are generated for each case reducer function
export const { 
    setBrands, 
} = BrandsSlice.actions

export default BrandsSlice.reducer