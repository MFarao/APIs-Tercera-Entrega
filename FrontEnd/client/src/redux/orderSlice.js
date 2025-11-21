import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const URL = "http://localhost:4002/order";

export const fetchOrders = createAsyncThunk(
    "orders/fetchOrders",
    async () => {
        const { data } = await axios.get(URL);
        return data;
    });

export const fetchOrdersUsuario = createAsyncThunk(
    "orders/fetchOrdersUsuario",
    async (usuarioId, { getState, rejectWithValue }) => {
        const { user } = getState();
        const token = user.token; // sacamos el token del estado global
        
        const { data } = await axios.get(`${URL}/user/${usuarioId}`, {  
            headers: { Authorization: `Bearer ${token}` },
        });        
        return data;
    });

const orderSlice = createSlice({
    name: "order",
    initialState: {
        orders: [], //ADMIN: Guarda todas las órdenes; USER: Guarda las órdenes del usuario
        ordenSeleccionada: null,
        filtrosAplicar: null,
        loading: false,
        error: null,
    },
    reducers: {
        setFiltrosAplicar: (state, action) => { // agregamos una accion de filtros q llene la variable con los datos
        state.filtrosAplicar = action.payload;
    }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchOrdersUsuario.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrdersUsuario.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(fetchOrdersUsuario.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    },
});

export const { setFiltrosAplicar } = orderSlice.actions;
export default orderSlice.reducer;