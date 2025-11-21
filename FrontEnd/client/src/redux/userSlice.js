import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const AUTH_URL = "http://localhost:4002/api/v1/auth";
const USERS_URL = "http://localhost:4002/users"

export const authenticateUser = createAsyncThunk(
  "auth/authenticateUser", 
  async (formData, {rejectWithValue}) => { // pedimos el bearer al back con los datos y luego pedimos los datos del usuario con ese token
    try{
      const response = await axios.post(`${AUTH_URL}/authenticate`, formData);
      
      const token = response.data.access_token || response.data.token || response.data.tokenJwt;
      if (!token) return rejectWithValue("No se recibió token del servidor");
      
      const responseUser = await axios.get(`${USERS_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return {token: token, userEnSesion: responseUser.data};
    }
    catch (err){
      return rejectWithValue(err.message || "Correo o contraseña incorrectos");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (formData, {rejectWithValue}) => {
    try {
      const response = await axios.post(`${AUTH_URL}/register`, formData); // registramos el usaurio

      const token = response.data.access_token || response.data.token || response.data.tokenJwt; // agarramos el token para agarrarlo
      if (!token) return rejectWithValue("No se recibió token del servidor");

      //Necesitamos el idUsuario
      const responseUser = await axios.get(`${USERS_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return {token: token, userEnSesion: responseUser.data};

    }catch (err) {
      return rejectWithValue(err.message || "No se pudo registrar el usuario");
    }
})

export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async (body, { getState, rejectWithValue }) => { // inyecyamos get state para poder acceder al token
    try {
      const state = getState();
      const token = state.user.token; // sacamos el token del estado global
      const idUser = getState().user.userEnSesion.id;

      const response = await axios.put(`${USERS_URL}/${body.idUser}`, body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }); //  hacemos un PUT con los datos y el token

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "No se pudo actualizar el usuario");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    token: null,
    userEnSesion: null,
    users: [],
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.userEnSesion = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(authenticateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(authenticateUser.fulfilled, (state, action) => {
        state.token = action.payload.token; // cargamos los datos del usuario en estado global
        state.userEnSesion = action.payload.userEnSesion;
      })
      .addCase(authenticateUser.rejected, (state, action) => {
        state.error = action.payload || "Error en la autenticación";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.userEnSesion = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.payload || "Error en el registro";
      })
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;