import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'


export interface SearchState {
    results: Array<any>,
}

const initialState: SearchState = {
    results: [],
}

export const SearchSlice = createSlice({
    name: 'Search',
    initialState,
    reducers: {
        fillSearchResults: (state, action: PayloadAction<any>) => {
            state.results = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const {
    fillSearchResults,
} = SearchSlice.actions

export default SearchSlice.reducer