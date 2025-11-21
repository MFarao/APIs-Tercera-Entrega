import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const uiSlice = createSlice({
  name: "UIs",
  initialState: {
    ultimaRuta: null,
  },
  reducers: {
    setUltimaRuta: (state, action) => { // agregamos una accion de q llene la variable con los datos de la ruta
    state.ultimaRuta = action.payload;
    },
  }
});

export const { setUltimaRuta } = uiSlice.actions;
export default uiSlice.reducer;
