import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../util/axiosInstance';

export const fetchSummary = createAsyncThunk(
  'dashboard/fetchSummary',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/dashboard/summary');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchSalesOverview = createAsyncThunk(
  'dashboard/fetchSalesOverview',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/dashboard/sales-overview');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchCategoryDistribution = createAsyncThunk(
  'dashboard/fetchCategoryDistribution',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/dashboard/category-distribution');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchTopProducts = createAsyncThunk(
  'dashboard/fetchTopProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/dashboard/top-products');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchRecentActivities = createAsyncThunk(
  'dashboard/fetchRecentActivities',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/dashboard/recent-activities');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchSalesTarget = createAsyncThunk(
  'dashboard/fetchSalesTarget',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/dashboard/sales-target');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    summary: null,
    salesOverview: [],
    categoryDistribution: [],
    topProducts: [],
    recentActivities: [],
    salesTarget: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSummary.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchSummary.fulfilled, (state, action) => { state.loading = false; state.summary = action.payload; })
      .addCase(fetchSummary.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchSalesOverview.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchSalesOverview.fulfilled, (state, action) => { state.loading = false; state.salesOverview = action.payload; })
      .addCase(fetchSalesOverview.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchCategoryDistribution.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchCategoryDistribution.fulfilled, (state, action) => { state.loading = false; state.categoryDistribution = action.payload; })
      .addCase(fetchCategoryDistribution.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchTopProducts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchTopProducts.fulfilled, (state, action) => { state.loading = false; state.topProducts = action.payload; })
      .addCase(fetchTopProducts.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchRecentActivities.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchRecentActivities.fulfilled, (state, action) => { state.loading = false; state.recentActivities = action.payload; })
      .addCase(fetchRecentActivities.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchSalesTarget.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchSalesTarget.fulfilled, (state, action) => { state.loading = false; state.salesTarget = action.payload; })
      .addCase(fetchSalesTarget.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export default dashboardSlice.reducer; 