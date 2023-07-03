import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'


interface FilterPayload {
    name: string;
}


export interface ProductsState {
    productsList: Array<any>,
    singleProduct: any,
}

const initialState: ProductsState = {
    productsList: [],
    singleProduct: []
}

export const ProductsSlice = createSlice({
    name: 'Products',
    initialState,
    reducers: {
        fillProductsList: (state, action: PayloadAction<Array<any>>) => {
            state.productsList = action.payload
        },
        fillSingleProduct: (state, action: PayloadAction<any>) => {
            state.singleProduct = action.payload
        },
        filterProductsList: (state, action: PayloadAction<FilterPayload>) => {
            switch (action.payload.name) {
                case "a-z":
                    state.productsList.sort((a, b) => a.title.localeCompare(b.title));
                    break;
                case "z-a":
                    state.productsList.sort((a, b) => b.title.localeCompare(a.title));
                    break;
                case "least-popular":
                    state.productsList.sort((a, b) => a.rating.localeCompare(b.rating));
                    break;
                case "highest-popular":
                    state.productsList.sort((a, b) => b.rating.localeCompare(a.rating));
                    break;
                case "high-low":
                    state.productsList.sort((a, b) => {
                        if (a.price !== null && b.price !== null) {
                            return parseFloat(b.price) - parseFloat(a.price);
                        }
                        const aPrice = a.attributes && JSON.parse(a.attributes).price ? JSON.parse(a.attributes).price[0] : 0;
                        const bPrice = b.attributes && JSON.parse(b.attributes).price ? JSON.parse(b.attributes).price[0] : 0;

                        return parseFloat(bPrice) - parseFloat(aPrice);
                    });
                    break;
                case "low-high":
                    state.productsList.sort((a, b) => {
                        if (a.price !== null && b.price !== null) {
                            return parseFloat(a.price) - parseFloat(b.price);
                        }
                        const aPrice = a.attributes && JSON.parse(a.attributes).price ? JSON.parse(a.attributes).price[0] : 0;
                        const bPrice = b.attributes && JSON.parse(b.attributes).price ? JSON.parse(b.attributes).price[0] : 0;

                        return parseFloat(aPrice) - parseFloat(bPrice);
                    });
                    break;
                default:
                    break;
            }
        },
    },
})

// Action creators are generated for each case reducer function
export const {
    fillProductsList,
    fillSingleProduct,
    filterProductsList,
} = ProductsSlice.actions

export default ProductsSlice.reducer