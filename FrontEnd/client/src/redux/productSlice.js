import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { updateCategory } from "./categoriesSlice";
import { updateDiscount, createDiscount, deactivateDiscount } from "./discountSlice";
import { createOrders } from "./orderSlice";

const URL = "http://localhost:4002/products";

const descuentoVigente = (endDate) => {
  if (!endDate) return false;
  return new Date(endDate) >= new Date();
};

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

export const selectVisibleProducts = (state) => {
  const { currentPage, pageSize, items } = state.products;
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  return items.slice(start, end);
};

export const selectTotalProductPages = (state) => {
  const { pageSize, items } = state.products;
  return Math.max(1, Math.ceil(items.length / pageSize));
};
 
const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    loading: false,
    error: null,
    filtrosAplicar: null, // estado para almacenar los filtros aplicados
    busqueda: "",
    productoSeleccionado: null,
    currentPage: 1, 
    pageSize: 12,
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
    },
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
      state.currentPage = 1; // resetear a primera página
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
        if (state.productoSeleccionado && state.productoSeleccionado.id === action.payload.id) {
          state.productoSeleccionado = action.payload;
        }
      })
      .addCase(in_activateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
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
      .addCase(createDiscount.fulfilled, (state, action) => {
        const d = action.payload;
        const porcentajeDecimal = d.percentage; // backend → 0.20

        // Asignar productos explícitos
        if (Array.isArray(d.productsId)) {
          d.productsId.forEach((prodId) => {
            const p = state.items.find((x) => x.id === prodId);
            if (p) {
              p.discountId = d.id;
              if (descuentoVigente(d.endDate)) {
        p.priceDescuento = Math.round(p.price * (1 - porcentajeDecimal));
        p.discountEndDate = d.endDate;
      } else {
        p.priceDescuento = null;
        p.discountEndDate = null;
      }
            }
          });
        }

        // Asignar productos por categorías (backend recorre TODOS los productos de cada categoría)
        if (Array.isArray(d.categoriesId)) {
          state.items.forEach((p) => {
            if (d.categoriesId.includes(p.categoryId)) {
              p.discountId = d.id;
              if (descuentoVigente(d.endDate)) {
        p.priceDescuento = Math.round(p.price * (1 - porcentajeDecimal));
        p.discountEndDate = d.endDate;
      } else {
        p.priceDescuento = null;
        p.discountEndDate = null;
      }
            }
          });
        }
      })
      .addCase(updateDiscount.fulfilled, (state, action) => {
        const d = action.payload;
        const porcentajeDecimal = d.percentage / 100;

        // Reasignar explícitamente productsId (backend hace eso)
        if (Array.isArray(d.productsId)) {
          d.productsId.forEach((prodId) => {
            const p = state.items.find((x) => x.id === prodId);
            if (p) {
              p.discountId = d.id;
              if (descuentoVigente(d.endDate)) {
        p.priceDescuento = Math.round(p.price * (1 - porcentajeDecimal) * 100) / 100;
        p.discountEndDate = d.endDate;
      } else {
        p.priceDescuento = null;
        p.discountEndDate = null;
      }
        }
      });
      }

        // Reasignar categorías (backend recorre TODOS los productos de cada categoría)
        if (Array.isArray(d.categoriesId)) {
          state.items.forEach((p) => {
            if (d.categoriesId.includes(p.categoryId)) {
              p.discountId = d.id;
              if (descuentoVigente(d.endDate)) {
        p.priceDescuento = Math.round(p.price * (1 - porcentajeDecimal) * 100) / 100;
        p.discountEndDate = d.endDate;
      } else {
        p.priceDescuento = null;
        p.discountEndDate = null;
      }
            }
          });
        }
      })
      .addCase(deactivateDiscount.fulfilled, (state, action) => {
        const discountId = action.payload.id;

  state.items.forEach((p) => {
    if (p.discountId === discountId) {
      p.discountId = null;
      p.priceDescuento = null;
      p.discountEndDate = null;
    }
  });
      })
      .addCase(createOrders.fulfilled, (state, action) => {
        action.payload.forEach((orden) => {
          const index = state.items.findIndex((p) => p.id === orden.idProducto);
          if (index !== -1) {
            state.items[index].stock -= orden.cantidadProducto;
          }
        });
      })
  },
});
 
export const { setFiltrosAplicar } = productSlice.actions;
export const { setBusqueda } = productSlice.actions;
export const { setProductoSeleccionado } = productSlice.actions;
export const { setPage, setPageSize } = productSlice.actions;
export default productSlice.reducer;