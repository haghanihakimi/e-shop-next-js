import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface OrdersState {
    orders: any,
    allOrders: any,
}

const initialState: OrdersState = {
    orders: {},
    allOrders: [],
}

export const OrdersSlice = createSlice({
    name: 'Orders',
    initialState,
    reducers: {
        setOrders: (state, action: PayloadAction<any>) => {
            if(state.orders && Object.keys(state.orders).length <= 0){
                state.orders = action.payload
            }
        },
        setAllOrders: (state, action: PayloadAction<any>) => {
            if(state.allOrders && state.allOrders.length <= 0){
                state.allOrders = action.payload
            }
        },
    },
})

// Action creators are generated for each case reducer function
export const { 
    setOrders, 
    setAllOrders,
} = OrdersSlice.actions

export default OrdersSlice.reducer