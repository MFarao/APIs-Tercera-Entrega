import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const URL = "http://localhost:4002/discounts";


export const fetchDiscounts = createAsyncThunk("discounts/fetchDiscounts", async (_, { getState }) => {
  const token = getState().user.token;
  const { data } = await axios.get(URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
});

export const updateDiscount = createAsyncThunk("discounts/updateDiscount", async ( body, { getState }) => { // inyecyamos get state para poder acceder al token
      console.log("Body en updateDiscount:", body);
  const token = getState().user.token; // sacamos el token del estado global   
        const { data } = await axios.put(`${URL}/${body.id}`, body, {
        headers: {Authorization: `Bearer ${token}`,},
        }); //hacemos un PUT con los datos y el token
        return { ...data, productsId: body.productsId, categoriesId: body.categoriesId }; // Devolvemos el producto actualizado
    }
);  

export const createDiscount = createAsyncThunk(
  "discounts/createDiscount",
  async ( discountData, { getState }) => {
    const token = getState().user.token;
    const { data } = await axios.post(URL, discountData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { ...data, productsId: discountData.productsId, categoriesId: discountData.categoriesId };
  }
);

export const deactivateDiscount = createAsyncThunk(
  "discounts/deactivateDiscount",
  async ({ id }, { getState }) => {
    const token = getState().user.token;
    const { data } = await axios.put(`${URL}/${id}/deactivate`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data; // devolvemos el descuento actualizado
  }
);

const discountsSlice = createSlice({
    name: "discounts",
    initialState: {
      items: [],
      loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchDiscounts.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchDiscounts.fulfilled, (state, action) => {
            state.loading = false;
            state.items = action.payload;
        })
        .addCase(updateDiscount.fulfilled, (state, action) => {
            const updatedDiscount = action.payload; 
            state.items = state.items.map(discount =>
                discount.id === updatedDiscount.id ? updatedDiscount : discount
            );
        })
        .addCase(createDiscount.fulfilled, (state, action) => {
          const newDiscount = { ...action.payload };
          newDiscount.percentage = Math.round(newDiscount.percentage * 100);
          state.items = [...state.items, newDiscount];
        })
        .addCase(deactivateDiscount.fulfilled, (state, action) => {
            const updatedDiscount = action.payload;
            state.items = state.items.map(discount =>
                discount.id === updatedDiscount.id ? updatedDiscount : discount
            );
        })
    },
});

export default discountsSlice.reducer;