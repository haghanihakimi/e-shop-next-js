import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { setCookie, getCookie } from 'cookies-next';

export interface ThemeState {
    theme: any,
}

const storedTheme = getCookie('theme'); //localStorage.getItem('theme');
const parsedTheme = storedTheme ? JSON.parse(storedTheme) : '';

const initialState: ThemeState = {
    theme: parsedTheme,
}

export const ThemeSlice = createSlice({
    name: 'Theme',
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<string>) => {
            setCookie('theme', JSON.stringify(action.payload));
            const storeTheme = getCookie('theme');
            state.theme = storeTheme ? JSON.parse(storeTheme) : '';
            if(document.querySelector('html') && document.querySelector('html')!.className !== null) {
                document.querySelector('html')!.className = state.theme
            }
        },
        getTheme: (state) => {
            if (state.theme.length >= 1) {
                const storeTheme = getCookie('theme');
                state.theme = storeTheme ? JSON.parse(storeTheme) : '';
                document.querySelector('html')!.className = state.theme
            } else {
                setCookie('theme', JSON.stringify('light'));
                const storeTheme = getCookie('theme');
                state.theme = storeTheme ? JSON.parse(storeTheme) : '';
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