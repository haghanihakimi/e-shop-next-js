import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

const storedCart = localStorage.getItem('cart');
const parsedStoredCart = storedCart ? JSON.parse(storedCart) : [];


export interface CartState {
    cart: Array<any>,
    shippingCost: number,
}

const initialState: CartState = {
    cart: parsedStoredCart,
    shippingCost: 90
}

export const CartSlice = createSlice({
    name: 'Cart',
    initialState,
    reducers: {
        fillCart: (state, action: PayloadAction<Array<any>>) => {
            if (state.cart.length <= 0) {
                state.cart = action.payload
            }
        },
        addToCart: (state, action: PayloadAction<any>) => {
            const existingItemIndex = state.cart.findIndex((item: any) => {
                return (
                    item.id === action.payload.id &&
                    item.color === action.payload.color &&
                    item.capacity === action.payload.capacity &&
                    item.dimensions === action.payload.dimensions
                );
            });

            if (existingItemIndex === -1) {
                // New item, doesn't exist in the cart
                state.cart.push(action.payload);
            } else {
                // The item exists, let's retrieve it
                const existingItem = state.cart[existingItemIndex];

                if (existingItem.quantity < existingItem.limit) {
                    // The item exists, and its quantity is less than the limit
                    existingItem.quantity = parseInt(existingItem.quantity) + parseInt(action.payload.quantity);
                } else {
                    // The item exists, and its quantity is equal to the limit
                    alert(`You can have ${action.payload.limit} of this item in your cart.`);
                }
            }
            localStorage.setItem('cart', JSON.stringify(state.cart));
        },
        updateCart: (state, action: PayloadAction<{ id: number; color: string; capacity: string; dimensions: string; newQuantity: any }>) => {
            const updatedCart = state.cart.map((cart: any) => {
                if (cart.id === action.payload.id &&
                    cart.color === action.payload.color &&
                    cart.capacity === action.payload.capacity &&
                    cart.dimensions === action.payload.dimensions) {
                    return { ...cart, quantity: action.payload.newQuantity };
                }
                return cart;
            });
            state.cart = updatedCart;
            localStorage.setItem('cart', JSON.stringify(state.cart));
        },
        deleteCartItem: (state, action: PayloadAction<{ id: number }>) => {
            let i = state.cart.map(cart => cart.id).indexOf(action.payload.id)
            state.cart.splice(i, 1)

            localStorage.setItem('cart', JSON.stringify(state.cart));
        },
        emptyCart: (state, action: PayloadAction) => {
            state.cart = [];

            localStorage.setItem('cart', JSON.stringify(state.cart));
        },
        setShippingCost: (state, action: PayloadAction<any>) => {
            state.shippingCost = action.payload
        }
    },
})

// Action creators are generated for each case reducer function
export const {
    fillCart,
    addToCart,
    updateCart,
    emptyCart,
    deleteCartItem,
    setShippingCost,
} = CartSlice.actions

export default CartSlice.reducer