import { configureStore } from '@reduxjs/toolkit'
import ThemeSlice from './reducers/theme'
import BrandsSlice from './reducers/brands'
import CategoriesSlice from './reducers/categories'
import ProductsSlice from './reducers/products'
import SingleProductsSlice from './reducers/singlePage'
import CartSlice from './reducers/cart'
import RelatedProducts from './reducers/relatedProducts'
import CountriesSlice from './reducers/countries'
import CouriersSlice from './reducers/couriers'
import OrdersSlice from './reducers/orders'
import FavoritesSlice from './reducers/favorites'
import CheckApiSlice from './reducers/checkApi'
import ProfileSlice from './reducers/profile'
import SearchSlice from './reducers/search'

export const store = configureStore({
  reducer: {
    theme: ThemeSlice,
    brands: BrandsSlice,
    categories: CategoriesSlice,
    products: ProductsSlice,
    singleProduct: SingleProductsSlice,
    cart: CartSlice,
    relatedProducts: RelatedProducts,
    countries: CountriesSlice,
    couriers: CouriersSlice,
    orders: OrdersSlice,
    favorites: FavoritesSlice,
    checkApi: CheckApiSlice,
    profile: ProfileSlice,
    search: SearchSlice,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch