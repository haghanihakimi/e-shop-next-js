import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface Payload {
    firstname: string;
    lastname: string;
    email: any;
    phone: string;
    image: any;
    country: string;
    street: string;
    city: string;
    state: string;
    postcode: string;
}

export interface ProfileState {
    firstname: string;
    lastname: string;
    email: any;
    phone: any;
    image: any;
    country: string;
    street: string;
    city: string;
    state: string;
    postcode: string;
    errors: Array<any>;
}

const initialState: ProfileState = {
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    image: '',
    country: '',
    street: '',
    city: '',
    state: '',
    postcode: '',
    errors: [],
}

export const ProfileSlice = createSlice({
    name: 'Profile',
    initialState,
    reducers: {
        setProfile: (state, action: PayloadAction<Partial<ProfileState>>) => {
            return { ...state, ...action.payload };
        },
        fillErrors: (state, action: PayloadAction<any>) => {
            state.errors = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const {
    setProfile,
    fillErrors,
} = ProfileSlice.actions

export default ProfileSlice.reducer