import { configureStore } from '@reduxjs/toolkit'
import ThemeSlice from './reducers/theme'
import BrandsSlice from './reducers/brands'
import ProductsSlice from './reducers/products'

export const store = configureStore({
  reducer: {
    theme: ThemeSlice,
    brands: BrandsSlice,
    products: ProductsSlice,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch