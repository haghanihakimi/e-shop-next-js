import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'


export interface CountriesState {
    countries: Array<any>,
}

const initialState: CountriesState = {
    countries: [],
}

export const CountriesSlice = createSlice({
    name: 'Countries',
    initialState,
    reducers: {
        setCountries: (state, action: PayloadAction<Array<any>>) => {
            if(state.countries.length <= 0) {
                state.countries = action.payload
            }
        },
    },
})

// Action creators are generated for each case reducer function
export const {
    setCountries
} = CountriesSlice.actions

export default CountriesSlice.reducer