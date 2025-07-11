import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchCategories = createAsyncThunk(
    'category/fetchCategories',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return rejectWithValue('Token not found in local storage.');
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.get('http://localhost:3000/api/getAllCategories', config);
            console.log(response.data.result,'category');
            
            return response.data.result;
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
    },
});

export const { resetCreateSuccess, resetUpdateSuccess, clearSelectedCategory } = categorySlice.actions;
export default categorySlice.reducer;
