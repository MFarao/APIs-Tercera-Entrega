import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    total: 0,
  },
  reducers: {
    sumarCarrito: (state, action) => {
      const producto = action.payload; // agarramos el producto
      const existe = state.items.find(item => item.id === producto.id); // buscamos si existe en el carrito y lo tomamos si asi lo ess
      if (existe) {
        existe.cantidad += 1; // le sumamos uno a su cantidad
      } else {
        state.items.push({ ...producto, cantidad: 1 }); // si no estaba lo agregamos con cantidad 1
      }
      if(producto.priceDescuento !== null){ // si tiene precio descuento lo sumamos al total
        state.total += producto.priceDescuento;
      }else{
        state.total += producto.price; // si no tiene el preciodescuento sumamos el normal
      }
    },
    sacarCarrito: (state, action) => {
      const producto = action.payload; // agarramos el producto
      const existe = state.items.find(item => item.id === producto.id); // buscamos si existe en el carrito y lo tomamos si asi lo ess
      if (existe.cantidad > 1) { // si tiene mas de una cantidad le restamos uno
        existe.cantidad -= 1;
      } else {
        // si no lo sacamos del carrito
        state.items = state.items.filter(item => item.id !== producto.id);
      }
      if(producto.priceDescuento !== null){ // si tiene precio descuento lo restamos al total
        state.total -= producto.priceDescuento;
      }else{
        state.total -= producto.price; // si no tiene el preciodescuento restamos el normal
      }
    },
    vaciarCarrito: (state) => {
      state.items = [];
      state.total = 0;
    },
  },
});

export const { sumarCarrito, sacarCarrito, vaciarCarrito} = cartSlice.actions;
export default cartSlice.reducer;
