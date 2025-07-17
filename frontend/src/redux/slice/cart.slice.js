import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../util/axiosInstance';

export const fetchCarts = createAsyncThunk(
  'cart/fetchCarts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/carts/');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
export const fetchUserCarts = createAsyncThunk(
  'cart/fetchUserCarts',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/carts/get-user-cart/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
export const createCart = createAsyncThunk(
  'cart/createCart',
  async (cartData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/carts/', cartData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateCart = createAsyncThunk(
  'cart/updateCart',
  async ({ id, cartData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/carts/${id}`, cartData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteCart = createAsyncThunk(
  'cart/deleteCart',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/carts/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addOrUpdateProduct = createAsyncThunk(
  'cart/addOrUpdateProduct',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/carts/add-or-update', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const removeProduct = createAsyncThunk(
  'cart/removeProduct',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/carts/remove', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    carts: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCarts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCarts.fulfilled, (state, action) => {
        state.loading = false;
        state.carts = action.payload;
      })
      .addCase(fetchCarts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserCarts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserCarts.fulfilled, (state, action) => {
        state.loading = false;
        state.carts = Array.isArray(action.payload)
          ? action.payload
          : Object.values(action.payload || {});
      })
      .addCase(fetchUserCarts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCart.fulfilled, (state, action) => {
        state.loading = false;
        state.carts.unshift(action.payload);
      })
      .addCase(createCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCart.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.carts.findIndex(c => c._id === action.payload._id);
        if (idx !== -1) state.carts[idx] = action.payload;
      })
      .addCase(updateCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCart.fulfilled, (state, action) => {
        state.loading = false;
        state.carts = state.carts.filter(c => c._id !== action.payload);
      })
      .addCase(deleteCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addOrUpdateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addOrUpdateProduct.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally update cart in state
      })
      .addCase(addOrUpdateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeProduct.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally update cart in state
      })
      .addCase(removeProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer; 