import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const URL = "http://localhost:4002/categories";


export const fetchCategories = createAsyncThunk("categories/fetchCategories", async () => {
  const { data } = await axios.get(URL);
  return data;
});

export const updateCategory = createAsyncThunk("categories/updateCategory", async ( {body}, { getState }) => { // inyecyamos get state para poder acceder al token
      const token = getState().user.token; // sacamos el token del estado global

      const { data } = await axios.put(`${URL}/${body.id}`, body, {
        headers: {Authorization: `Bearer ${token}`,},
      }); //hacemos un PUT con los datos y el token

      return data; // Devolvemos el producto actualizado
  }
);  

export const createCategory = createAsyncThunk(
  "categories/createCategory",
  async ( body, { getState }) => {
    const token = getState().user.token;
    const { data } = await axios.post(URL, body, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  }
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.items = state.items.map((category) =>
          category.id === action.payload.id ? action.payload : category
      )})
      .addCase(createCategory.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
  },
});

export default categoriesSlice.reducer;