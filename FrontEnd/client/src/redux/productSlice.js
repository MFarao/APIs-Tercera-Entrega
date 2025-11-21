import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { updateCategory } from "./categoriesSlice";
 
const URL = "http://localhost:4002/products";
 
export const fetchProducts = createAsyncThunk("products/fetchProducts", async () => {
  const { data } = await axios.get(URL);
  return data;
});
 
export const createProduct = createAsyncThunk(
  "products/createProduct",
  async ( body, { getState }) => {
    const token = getState().user.token;
    const { data } = await axios.post(URL, body, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  }
);
 
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ( {body, idProducto}, { getState }) => { // inyecyamos get state para poder acceder al token
      const token = getState().user.token; // sacamos el token del estado global
      const { data } = await axios.put(`${URL}/${idProducto}`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }); //hacemos un PUT con los datos y el token
      return data; // Devolvemos el producto actualizado
  }
);  
 
export const in_activateProduct = createAsyncThunk(
  "products/in_activateProduct",
  async ( idProducto, { getState }) => {
      const token = getState().user.token; // sacamos el token del estado global
      const { data } = await axios.put(`${URL}/${idProducto}/in_activar`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data; // Devolvemos el producto actualizado
  }
);
 
const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    loading: false,
    error: null,
    filtrosAplicar: null, // estado para almacenar los filtros aplicados
    busqueda: "",
    productoSeleccionado: null,
  },
  reducers: {        
    setFiltrosAplicar: (state, action) => { // agregamos una accion de filtros q llene la variable con los datos
    state.filtrosAplicar = action.payload;
    },
    setBusqueda: (state, action) => { // agregamos una accion de busqueda q llene la variable con los datos
    state.busqueda = action.payload;
    },
    setProductoSeleccionado: (state, action) => { // accion para setear el producto seleccionado
      state.productoSeleccionado = state.items.find(
        (product) => product.id === Number(action.payload)
      ) || null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.items = [...state.items, action.payload];
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (product) => product.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(in_activateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (product) => product.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(in_activateProduct.rejected, (state, action) => {
        state.error = action.payload;
      })
      //Redux Toolkit permite que un slice escuche acciones de otro thunk
      .addCase(updateCategory.fulfilled, (state, action) => {
        const updatedCategory = action.payload;
        state.items = state.items.map((prod) =>
          prod.categoryId === updatedCategory.id
            ? { ...prod, categoryName: updatedCategory.description }
            : prod
        );
      })
  },
});
 
export const { setFiltrosAplicar } = productSlice.actions;
export const { setBusqueda } = productSlice.actions;
export const { setProductoSeleccionado } = productSlice.actions;
export default productSlice.reducer;