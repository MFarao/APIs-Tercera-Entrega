import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Swal from "sweetalert2";

const AUTH_URL = "http://localhost:4002/api/v1/auth";
const USERS_URL = "http://localhost:4002/users"

export const fetchUsers = createAsyncThunk("users/fetchUsers", async (_, { getState } ) => { 
  const token = getState().user.token; // sacamos el token del estado global
  const { data } = await axios.get(USERS_URL, {headers: { Authorization: `Bearer ${token}` }}); // le pasamos token para que lo autorice
  return data;
});

export const authenticateUser = createAsyncThunk("auth/authenticateUser", async (formData) => { // pedimos el bearer al back con los datos y luego pedimos los datos del usuario con ese token
  const { data } = await axios.post(`${AUTH_URL}/authenticate`, formData);
  
  const token = data.access_token || data.token || data.tokenJwt || data.accessToken;
  return token;
  }
);

export const registerUser = createAsyncThunk("auth/registerUser", async (formData) => {
  const { data } = await axios.post(`${AUTH_URL}/register`, formData); // registramos el usuario
  const token = data.access_token || data.token || data.tokenJwt || data.accessToken; // agarramos el token
  return token;
})

export const fetchUserData = createAsyncThunk("user/fetchUserData", async (_, { getState }) => {
  const token = getState().user.token; // sacamos el token del estado global
  const { data } = await axios.get(`${USERS_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
  }
);

export const updateUser = createAsyncThunk("auth/updateUser", async (body, { getState }) => { // inyecyamos get state para poder acceder al token
  const token = getState().user.token; // sacamos el token del estado global

  const { data } = await axios.put(`${USERS_URL}/${body.idUser}`, body, {
    headers: {"Content-Type": "application/json", Authorization: `Bearer ${token}`,},
  }); //  hacemos un PUT con los datos y el token

  return data; // Devolvemos el usuario actualizado
}
);

export const un_blockUser = createAsyncThunk("users/un_blockUser", async ( body,  { getState }) => {
  const token = getState().user.token; // sacamos el token del estado global

  const { data } = await axios.put(`${USERS_URL}/${body.idUser}/un_block`, body, { //hacemos un PUT con los datos y el token
    headers: { Authorization: `Bearer ${token}`},
  }); 
  return data; // Devolvemos el producto actualizado
}
);  

export const selectVisibleUsers = (state) => {
  const { currentPage, pageSize, users } = state.user;
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  return users.slice(start, end);
};

export const selectTotalUserPages = (state) => {
  const { pageSize, users } = state.user;
  return Math.max(1, Math.ceil(users.length / pageSize));
};

const userSlice = createSlice({
  name: "user",
  initialState: {
    token: null,
    userEnSesion: null,
    users: [],
    loading: false,
    error: null,
    currentPage: 1,
    pageSize: 10,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.userEnSesion = null;
      state.error = null;
    },
    setPage: (state, action) => {
    state.currentPage = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
      state.currentPage = 1; // resetear a primera pagina
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(authenticateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(authenticateUser.fulfilled, (state, action) => {
        state.token = action.payload; // cargamos los datos del usuario en estado global
        state.loading = false;
      })
      .addCase(authenticateUser.rejected, (state, action) => {
        state.error = action.payload || "Error en la autenticación";
      })

      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.token = action.payload;
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.payload || "Error en el registro";
      })

      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.userEnSesion = action.payload; // cargamos los datos del usuario en estado global
        state.loading = false;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.error = action.payload || "Error al obtener los datos del usuario";
      })

      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.loading = false;
      })

      .addCase(un_blockUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(un_blockUser.fulfilled, (state, action) => {
        const index = state.users.findIndex( // buscamos el id del usuario actualizado
          (user) => user.id === action.payload.id
        );
        if (index !== -1) {
          state.users[index] = action.payload; // lo actualizamos en la lista global
        }
        state.loading = false;
      })
      .addCase(un_blockUser.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })

      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })
  },
});

export const { logout, setPage, setPageSize } = userSlice.actions;
export default userSlice.reducer;