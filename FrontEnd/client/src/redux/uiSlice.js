import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "UIs",
  initialState: {
    ultimaRuta: null,
    envio: "",
    conectado: false,
  },
  reducers: {
    setUltimaRuta: (state, action) => { // agregamos una accion de q llene la variable con los datos de la ruta
    state.ultimaRuta = action.payload;
    },
    setEnvio: (state, action) => { // agregamos una accion de q llene la variable con los datos del envio
    state.envio = action.payload;
    },
    setConectado: (state, action) => { // pasamos conectado a true
    state.conectado = action.payload;
    },
  }
});

export const { setUltimaRuta, setConectado, setEnvio} = uiSlice.actions;
export default uiSlice.reducer;
