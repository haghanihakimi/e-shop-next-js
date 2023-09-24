import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface CategoryProducts {
    name: string;
    ProductCategory: Array<any>
}

export interface CategoriesState {
    categories: Array<any>,
    categoryProducts: CategoryProducts,
}

const initialState: CategoriesState = {
    categories: [],
    categoryProducts: {
        name: '',
        ProductCategory: [],
    },
}

export const CategoriesSlice = createSlice({
    name: 'Categories',
    initialState,
    reducers: {
        setCategories: (state, action: PayloadAction<any>) => {
            if (state.categories.length <= 0) {
                const sortedCategories = action.payload.slice().sort((a: any, b: any) => {
                    return a.name.localeCompare(b.name, undefined, {
                        sensitivity: 'base',
                    });
                });

                state.categories = sortedCategories;
            }
        },
        setCategoryProducts: (state, action: PayloadAction<any>) => {
            state.categoryProducts = {
                name: '',
                ProductCategory: [],
            }
            state.categoryProducts = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const {
    setCategories,
    setCategoryProducts,
} = CategoriesSlice.actions

export default CategoriesSlice.reducer