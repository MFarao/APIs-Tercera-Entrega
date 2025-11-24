import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Swal from "sweetalert2";

const URL = "http://localhost:4002/order";

export const fetchOrders = createAsyncThunk("orders/fetchOrders", async (a, {getState}) => {

        const token = getState().user.token;// agaramos el token del estado global

        const { data } = await axios.get(URL, 
        {headers: { Authorization: `Bearer ${token}`,
        }});
        return data;
    });

export const fetchOrdersUsuario = createAsyncThunk("orders/fetchOrdersUsuario",
    async (usuarioId, { getState }) => {
        const token = getState().user.token; // sacamos el token del estado global
        
        const { data } = await axios.get(`${URL}/user/${usuarioId}`, {  
            headers: { Authorization: `Bearer ${token}` },
        });        
        return data;
    });

export const updateStatus = createAsyncThunk("orders/updateStatus",
    async ({body, idOrder}, { getState }) => {
        const token = getState().user.token; // sacamos el token del estado global
        const { data } = await axios.put(`${URL}/${idOrder}/status`, body, {  // cambiamos el status
            headers: { Authorization: `Bearer ${token}` },
        });
        return data;
    });

export const createOrders = createAsyncThunk("orders/createOrders",
    async (body, { getState }) => {
        const token = getState().user.token; // sacamos el token del estado global
        const { data } = await axios.post(`${URL}/checkout`, body, {
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
            .addCase(updateStatus.fulfilled, (state, action) => {
                const index = state.orders.findIndex( // buscamos el id de la orden actualizada
                (order) => order.id === action.payload.id
                );
                if (index !== -1) {
                state.orders[index] = action.payload; // lo actualizamos en la lista global
                }
                state.loading = false;
            })
            .addCase(updateStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;

                Swal.fire({
                    title: "Error",
                    text: "No se pudo cambiar de estado a la orden.",
                    icon: "error",
                    confirmButtonColor: "#7b2ff7" // usamos sweet alerts apra mostrar los errores
                })
            })
            .addCase(createOrders.fulfilled, (state, action) => {
                state.orders.unshift(...action.payload); // agregás todas las nuevas ordenes al estado global
                state.loading = false;
            })
            .addCase(createOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;

                Swal.fire({
                    title: "Error",
                    text: "No se pudo crear las ordenes.",
                    icon: "error",
                    confirmButtonColor: "#7b2ff7" // usamos sweet alerts apra mostrar los errores
                })
            })

    },
});

export const { setFiltrosAplicar } = orderSlice.actions;
export default orderSlice.reducer;