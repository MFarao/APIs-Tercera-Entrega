import {configureStore} from '@reduxjs/toolkit'
import productsReducer from './productSlice'
import categoriesReducer from './categoriesSlice'
import userReducer from './userSlice'
import ordersReducer from './orderSlice'
import uiReducer from './uiSlice'

export const store = configureStore({
    reducer: {
        products: productsReducer, 
        categories : categoriesReducer, 
        user: userReducer,
        order: ordersReducer,
        UIs: uiReducer}
})