import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface CheckApiState {
    courier: boolean;
    uploadthing: boolean;
}

const initialState: CheckApiState = {
    courier: false,
    uploadthing: false,
}

export const CheckApiSlice = createSlice({
    name: 'CheckApi',
    initialState,
    reducers: {
        setCourier: (state, action: PayloadAction<any>) => {
            state.courier = action.payload
        },
        setUploadthing: (state, action: PayloadAction<any>) => {
            state.uploadthing = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const {
    setCourier,
    setUploadthing,
} = CheckApiSlice.actions

export default CheckApiSlice.reducer