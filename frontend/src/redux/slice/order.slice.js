import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../util/axiosInstance';

export const fetchOrders = createAsyncThunk(
  'order/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/orders/');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  'order/fetchMyOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/orders/my-orders');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const placeOrder = createAsyncThunk(
  'order/placeOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/orders/', orderData);      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'order/updateOrderStatus',
  async ({ id, statusData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/orders/${id}/status`, statusData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteOrder = createAsyncThunk(
  'order/deleteOrder',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/orders/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchSellerOrders = createAsyncThunk(
  'order/fetchSellerOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/orders/seller-orders');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    orders: [],
    myOrders: [],
    sellerOrders: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchOrders.fulfilled, (state, action) => { state.loading = false; state.orders = action.payload; })
      .addCase(fetchOrders.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchMyOrders.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchMyOrders.fulfilled, (state, action) => { state.loading = false; state.myOrders = action.payload; })
      .addCase(fetchMyOrders.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(placeOrder.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(placeOrder.fulfilled, (state, action) => { state.loading = false; state.orders.unshift(action.payload); })
      .addCase(placeOrder.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(updateOrderStatus.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateOrderStatus.fulfilled, (state, action) => { state.loading = false; const idx = state.orders.findIndex(o => o._id === action.payload._id); if (idx !== -1) state.orders[idx] = action.payload; })
      .addCase(updateOrderStatus.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(deleteOrder.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(deleteOrder.fulfilled, (state, action) => { state.loading = false; state.orders = state.orders.filter(o => o._id !== action.payload); })
      .addCase(deleteOrder.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchSellerOrders.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchSellerOrders.fulfilled, (state, action) => { state.loading = false; state.sellerOrders = action.payload; })
      .addCase(fetchSellerOrders.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});
export default orderSlice.reducer; 