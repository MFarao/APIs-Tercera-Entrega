import {configureStore} from '@reduxjs/toolkit'
import productsReducer from './productSlice'
import categoriesReducer from './categoriesSlice'
import userReducer from './userSlice'
import ordersReducer from './orderSlice'
import uiReducer from './uiSlice'
import cartReducer from './cartSlice'
import discountsReducer from './discountSlice'


export const store = configureStore({
    reducer: {
        products: productsReducer, 
        categories : categoriesReducer, 
        user: userReducer,
        order: ordersReducer,
        discounts: discountsReducer,
        UIs: uiReducer,
        cart: cartReducer}
})