import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Swal from "sweetalert2";

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
  async ( description, { getState }) => {
    const token = getState().user.token;
    const { data } = await axios.post(URL, description, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  }
);

export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async ( id, { getState }) => {
    const token = getState().user.token;
    await axios.delete(`${URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return id;
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
        const updatedCategory = action.payload;
        // actualizar Categorias 
        state.items = state.items.map(cat =>
          cat.id === updatedCategory.id ? updatedCategory : cat
        );
        Swal.fire("Editada", "La categoría fue actualizada correctamente ✅", "success");
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.items = [...state.items, action.payload];
      })
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        const deletedCategoryId = action.payload;
        // Hace un filter para crear un nuevo array sin la categoria eliminada
        state.items = state.items.filter(cat => cat.id !== deletedCategoryId);
      })
      .addCase(deleteCategory.rejected, (state) => {
        state.loading = false;
        state.error = "No se pudo eliminar la categoría.";
      });
  },
});

export default categoriesSlice.reducer;