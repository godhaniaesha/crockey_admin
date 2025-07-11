import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};
      const response = await axios.get('http://localhost:5000/api/products/', config);
      console.log("Product fetched..!!", response.data)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createProduct = createAsyncThunk(
  'product/createProduct',
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      // Get userId from localStorage
      const userId = localStorage.getItem('userId');
      if (userId && !formData.has('user_id')) {
        formData.append('user_id', userId);
      }
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };
      const response = await axios.post(
        'http://localhost:5000/api/products/',
        formData,
        config
      );
      // If your backend returns { result: { ...product } }
      return response.data.result || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  'product/updateProduct',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };
      const response = await axios.put(
        `http://localhost:5000/api/products/${id}`,
        formData,
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally add the new product to the list
        if (Array.isArray(state.products?.result)) {
          state.products.result.unshift(action.payload);
        } else if (Array.isArray(state.products)) {
          state.products.unshift(action.payload);
        }
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally update the product in the list
        if (Array.isArray(state.products?.result)) {
          const idx = state.products.result.findIndex(p => p._id === action.payload._id);
          if (idx !== -1) state.products.result[idx] = action.payload;
        } else if (Array.isArray(state.products)) {
          const idx = state.products.findIndex(p => p._id === action.payload._id);
          if (idx !== -1) state.products[idx] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;
