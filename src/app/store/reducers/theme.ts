import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface ThemeState {
    theme: any,
}

const storedTheme = localStorage.getItem('theme');
const parsedTheme = storedTheme ? JSON.parse(storedTheme) : '';

const initialState: ThemeState = {
    theme: parsedTheme,
}

export const ThemeSlice = createSlice({
    name: 'Theme',
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<string>) => {
            localStorage.setItem('theme', JSON.stringify(action.payload))
            const storeTheme = localStorage.getItem('theme');
            state.theme = storeTheme ? JSON.parse(storeTheme) : '';
            if(document.querySelector('html') && document.querySelector('html')!.className !== null) {
                document.querySelector('html')!.className = state.theme
            }
        },
        getTheme: (state) => {
            if (state.theme.length >= 1) {
                const storeTheme = localStorage.getItem('theme');
                state.theme = storeTheme ? JSON.parse(storeTheme) : '';
                document.querySelector('html')!.className = state.theme
            } else {
                localStorage.setItem('theme', JSON.stringify('light'))
                const storeTheme = localStorage.getItem('theme');
                state.theme = storeTheme ? JSON.parse(storeTheme) : '';
                console.log(state.theme.length);
            }
        },
    },
})

// Action creators are generated for each case reducer function
export const { 
    setTheme, 
    getTheme,
} = ThemeSlice.actions

export default ThemeSlice.reducer