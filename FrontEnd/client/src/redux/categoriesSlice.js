import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const URL = "http://localhost:4002/categories";


export const fetchCategories = createAsyncThunk("categories/fetchCategories", async () => {
  const { data } = await axios.get(URL);
  return data;
});

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
  },
});

export default categoriesSlice.reducer;