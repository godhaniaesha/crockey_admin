import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../util/axiosInstance';

export const fetchWishlists = createAsyncThunk(
  'wishlist/fetchWishlists',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/wishlist/');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createWishlist = createAsyncThunk(
  'wishlist/createWishlist',
  async (wishlistData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/wishlist/', wishlistData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateWishlist = createAsyncThunk(
  'wishlist/updateWishlist',
  async ({ id, wishlistData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/wishlist/${id}`, wishlistData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteWishlist = createAsyncThunk(
  'wishlist/deleteWishlist',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/wishlist/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addProductToWishlist = createAsyncThunk(
  'wishlist/addProductToWishlist',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/wishlist/add', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const removeProductFromWishlist = createAsyncThunk(
  'wishlist/removeProductFromWishlist',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/wishlist/remove', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    wishlists: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlists.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlists = action.payload;
      })
      .addCase(fetchWishlists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlists.unshift(action.payload);
      })
      .addCase(createWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateWishlist.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.wishlists.findIndex(w => w._id === action.payload._id);
        if (idx !== -1) state.wishlists[idx] = action.payload;
      })
      .addCase(updateWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlists = state.wishlists.filter(w => w._id !== action.payload);
      })
      .addCase(deleteWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addProductToWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProductToWishlist.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally update wishlist in state
      })
      .addCase(addProductToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeProductFromWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeProductFromWishlist.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally update wishlist in state
      })
      .addCase(removeProductFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default wishlistSlice.reducer; 