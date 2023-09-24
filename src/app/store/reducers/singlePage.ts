import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'


export interface SingleProductsState {
    currentPrice: number,
    images: any,
    color: any,
    colorName: any,
    size: any,
    capacity: any,
    weight: any,
    width: any,
    height: any,
    dimensions: any,
}

const initialState: SingleProductsState = {
    currentPrice: 0,
    images: [],
    color: null,
    colorName: null,
    size: null,
    capacity: null,
    weight: null,
    width: null,
    height: null,
    dimensions: null,
}

export const SingleProductsSlice = createSlice({
    name: 'SingleProducts',
    initialState,
    reducers: {
        setCurrentPrice: (state, action: PayloadAction<number>) => {
            state.currentPrice = action.payload
        },
        fillImages: (state, action: PayloadAction<any>) => {
            state.images = action.payload
        },
        setColor: (state, action: PayloadAction<any>) => {
            state.color = action.payload
        },
        setColorName: (state, action: PayloadAction<any>) => {
            state.colorName = action.payload
        },
        setSize: (state, action: PayloadAction<any>) => {
            state.size = action.payload
        },
        setCapacity: (state, action: PayloadAction<any>) => {
            state.capacity = action.payload
        },
        setWeight: (state, action: PayloadAction<any>) => {
            state.weight = action.payload
        },
        setWidth: (state, action: PayloadAction<any>) => {
            state.width = action.payload
        },
        setHeight: (state, action: PayloadAction<any>) => {
            state.height = action.payload
        },
        setDimensions: (state, action: PayloadAction<any>) => {
            state.dimensions = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const {
    setCurrentPrice,
    fillImages,
    setColor,
    setColorName,
    setSize,
    setCapacity,
    setDimensions,
    setHeight,
    setWeight,
    setWidth,
} = SingleProductsSlice.actions

export default SingleProductsSlice.reducer