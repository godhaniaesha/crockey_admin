import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchSubcategories = createAsyncThunk(
  'subcategory/fetchSubcategories',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};
      const response = await axios.get('http://localhost:5000/api/subcategories/', config);
      console.log(response.data, "Subcategory fetched..!!") 
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
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };
      const response = await axios.post(
        'http://localhost:5000/api/subcategories/',
        formData,
        config
      );
      return response.data; // adjust if your backend wraps in {result: ...}
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateSubcategory = createAsyncThunk(
  'subcategory/updateSubcategory',
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
        `http://localhost:5000/api/subcategories/${id}`,
        formData,
        config
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
      const token = localStorage.getItem('token');
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};
      await axios.delete(`http://localhost:5000/api/subcategories/${id}`, config);
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
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.patch(
        `http://localhost:5000/api/subcategories/${id}/toggle-status`,
        {},
        config
      );
      return response.data.subcategory || response.data.result || response.data; // Adjust based on backend
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
        // Optionally, add the new subcategory to the list:
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
        // Optionally update the subcategory in the list
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
        // Update the subcategory status in the list
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
