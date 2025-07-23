import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../util/axiosInstance';

export const fetchSubcategories = createAsyncThunk(
  'subcategory/fetchSubcategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/subcategories/');
      console.log(response.data, "Subcategory fetched..!!");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createSubcategory = createAsyncThunk(
  'subcategory/createSubcategory',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        '/subcategories/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data', // ✅ Necessary for file uploads
          },
        }
      );
      return response.data; // Adjust if your backend wraps result
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateSubcategory = createAsyncThunk(
  'subcategory/updateSubcategory',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/subcategories/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data', // ✅ Required for file upload
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteSubcategory = createAsyncThunk(
  'subcategory/deleteSubcategory',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/subcategories/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const toggleSubcategoryStatus = createAsyncThunk(
  'subcategory/toggleSubcategoryStatus',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/subcategories/${id}/toggle-status`
      );
      return response.data.subcategory || response.data.result || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const subcategorySlice = createSlice({
  name: 'subcategory',
  initialState: {
    subcategories: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubcategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubcategories.fulfilled, (state, action) => {
        state.loading = false;
        state.subcategories = action.payload;
      })
      .addCase(fetchSubcategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createSubcategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubcategory.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(state.subcategories)) {
          state.subcategories.unshift(action.payload);
        }
      })
      .addCase(createSubcategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateSubcategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSubcategory.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(state.subcategories)) {
          const idx = state.subcategories.findIndex(sc => sc._id === action.payload._id);
          if (idx !== -1) state.subcategories[idx] = action.payload;
        }
      })
      .addCase(updateSubcategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteSubcategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSubcategory.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(state.subcategories)) {
          state.subcategories = state.subcategories.filter(sc => sc._id !== action.payload && sc.subcat_id !== action.payload);
        }
      })
      .addCase(deleteSubcategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(toggleSubcategoryStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleSubcategoryStatus.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(state.subcategories)) {
          const idx = state.subcategories.findIndex(sc => sc._id === action.payload._id);
          if (idx !== -1) state.subcategories[idx] = action.payload;
        }
      })
      .addCase(toggleSubcategoryStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default subcategorySlice.reducer;
