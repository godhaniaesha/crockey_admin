import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../util/axiosInstance';

export const fetchCategories = createAsyncThunk(
    'category/fetchCategories',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/categories/');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const createCategory = createAsyncThunk(
  'category/createCategory',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        '/categories/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data', // ✅ VERY IMPORTANT
          },
        }
      );
      console.log(response.data.result, "Category Created..!!");
      return response.data.result;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


export const updateCategory = createAsyncThunk(
  'category/updateCategory',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/categories/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data', // ✅ Needed for file upload
          },
        }
      );
      return response.data.result;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


export const deleteCategory = createAsyncThunk(
  'category/deleteCategory',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/categories/${id}`);
      return id; // Return the deleted id for updating state
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const toggleCategoryStatus = createAsyncThunk(
  'category/toggleCategoryStatus',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/categories/${id}/toggle-status`,
        {},
      );
      return response.data.category || response.data.result || response.data; // Adjust based on backend
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


const categorySlice = createSlice({
    name: 'category',
    initialState: {
        categories: [],
        selectedCategory: null,
        loading: false,
        error: null,
        createSuccess: false,
        updateSuccess: false,
    },
    reducers: {
        resetCreateSuccess(state) {
            state.createSuccess = false;
        },
        resetUpdateSuccess(state) {
            state.updateSuccess = false;
        },
        clearSelectedCategory(state) {
            state.selectedCategory = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.createSuccess = false;
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.createSuccess = true;
                // Optionally, add the new category to the list:
                if (Array.isArray(state.categories?.result)) {
                    state.categories.result.unshift(action.payload);
                } else if (Array.isArray(state.categories)) {
                    state.categories.unshift(action.payload);
                }
            })
            .addCase(createCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.createSuccess = false;
            })
            .addCase(updateCategory.pending, (state) => {
  state.loading = true;
  state.error = null;
  state.updateSuccess = false;
})
.addCase(updateCategory.fulfilled, (state, action) => {
  state.loading = false;
  state.updateSuccess = true;
  // Optionally update the category in the list
  if (Array.isArray(state.categories?.result)) {
    const idx = state.categories.result.findIndex(cat => cat._id === action.payload._id);
    if (idx !== -1) state.categories.result[idx] = action.payload;
  } else if (Array.isArray(state.categories)) {
    const idx = state.categories.findIndex(cat => cat._id === action.payload._id);
    if (idx !== -1) state.categories[idx] = action.payload;
  }
})
.addCase(updateCategory.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
  state.updateSuccess = false;
})
.addCase(deleteCategory.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(deleteCategory.fulfilled, (state, action) => {
  state.loading = false;
  // Remove the deleted category from the list
  if (Array.isArray(state.categories?.result)) {
    state.categories.result = state.categories.result.filter(cat => cat._id !== action.payload);
  } else if (Array.isArray(state.categories)) {
    state.categories = state.categories.filter(cat => cat._id !== action.payload);
  }
})
.addCase(deleteCategory.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})
.addCase(toggleCategoryStatus.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(toggleCategoryStatus.fulfilled, (state, action) => {
  state.loading = false;
  // Update the category status in the list
  if (Array.isArray(state.categories?.result)) {
    const idx = state.categories.result.findIndex(cat => cat._id === action.payload._id);
    if (idx !== -1) state.categories.result[idx] = action.payload;
  } else if (Array.isArray(state.categories)) {
    const idx = state.categories.findIndex(cat => cat._id === action.payload._id);
    if (idx !== -1) state.categories[idx] = action.payload;
  }
})
.addCase(toggleCategoryStatus.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})
    },
});

export const { resetCreateSuccess, resetUpdateSuccess, clearSelectedCategory } = categorySlice.actions;
export default categorySlice.reducer;
