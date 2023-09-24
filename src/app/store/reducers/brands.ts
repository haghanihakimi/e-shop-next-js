import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface BrandProducts {
    title: string;
    products: Array<any>
}

export interface BrandsState {
    brands: Array<any>,
    brandProducts: BrandProducts,
}

const initialState: BrandsState = {
    brands: [],
    brandProducts: {
        title: '',
        products: [],
    },
}

export const BrandsSlice = createSlice({
    name: 'Brands',
    initialState,
    reducers: {
        setBrands: (state, action: PayloadAction<any>) => {
            if (state.brands.length <= 0) {
                state.brands = action.payload
            }
        },
        setBrandProducts: (state, action: PayloadAction<any>) => {
            state.brandProducts = {
                title: '',
                products: [],
            }
            state.brandProducts = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { 
    setBrands, 
    setBrandProducts,
} = BrandsSlice.actions

export default BrandsSlice.reducer