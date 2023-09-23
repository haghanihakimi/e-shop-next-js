import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'


export interface CouriersState {
    suburbs: Array<any>,
    couriers: Array<any>,
}

const initialState: CouriersState = {
    suburbs: [],
    couriers: [],
}

export const CouriersSlice = createSlice({
    name: 'Couriers',
    initialState,
    reducers: {
        setSuburbs: (state, action: PayloadAction<Array<any>>) => {
            state.suburbs = [];
            if(state.suburbs.length <= 0) {
                state.suburbs = action.payload
            }
        },
        setCouriers: (state, action: PayloadAction<Array<any>>) => {
            state.couriers = [];
            if(state.couriers.length <= 0) {
                state.couriers = action.payload
            }
        },
    },
})

// Action creators are generated for each case reducer function
export const {
    setSuburbs,
    setCouriers,
} = CouriersSlice.actions

export default CouriersSlice.reducer