import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../util/axiosInstance';


// Async thunk for user registration
export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/auth/register`, userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Async thunk for user login
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/auth/login`, userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Async thunk for forgot password
export const forgotPassword = createAsyncThunk(
    'auth/forgotPassword',
    async (email, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/auth/forgot-password`, { email });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Async thunk for OTP verification
export const verifyOTP = createAsyncThunk(
    'auth/verifyOTP',
    async (otpData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/auth/verify-password-reset-otp`, otpData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Async thunk for reset password
export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async (resetData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/auth/reset-password`, resetData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Fetch current user profile (GET)
export const fetchUserProfile = createAsyncThunk(
    'auth/fetchUserProfile',
    async (userId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
            const response = await axiosInstance.get(`/auth/users/${userId}`);
            // console.log("resposne",response.data.data);
            
            return response.data.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Update current user profile (PUT, with image)
export const updateUserProfile = createAsyncThunk(
    'auth/updateUserProfile',
    async ({ userId, formData }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
            const response = await axiosInstance.put(`/auth/change-profile/${userId}`, formData, config);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const getUserById = createAsyncThunk(
    'auth/getUserById',
    async ({ userId }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
            const response = await axiosInstance.get(`/auth/users/${userId}`, config);

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        success: false,
        message: '',
        accessToken: null,
        otpSent: false,
        otpVerified: false,
        resetToken: null,
        profile: null,
        profileLoading: false,
        profileError: null,
        profileUpdateSuccess: false,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSuccess: (state) => {
            state.success = false;
            state.message = '';
        },
        clearOtpStatus: (state) => {
            state.otpSent = false;
            state.otpVerified = false;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.accessToken = null;
            state.error = null;
            state.success = false;
            state.message = '';
        },
        clearProfileStatus: (state) => {
            state.profileUpdateSuccess = false;
            state.profileError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Register User
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload.message || 'Registration successful';
                if (action.payload.data) {
                    state.user = action.payload.data;
                    state.isAuthenticated = true;
                    state.accessToken = action.payload.accessToken;
                }
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Login User
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload.message || 'Login successful';
                state.user = action.payload.data;
                state.isAuthenticated = true;
                state.accessToken = action.payload.accessToken;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Forgot Password
            .addCase(forgotPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(forgotPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload.message || 'OTP sent successfully';
                state.otpSent = true;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Verify OTP
            .addCase(verifyOTP.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyOTP.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload.message || 'OTP verified successfully';
                state.otpVerified = true;
                state.resetToken = action.payload.resetToken;
            })
            .addCase(verifyOTP.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Reset Password
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload.message || 'Password reset successful';
                state.otpSent = false;
                state.otpVerified = false;
                state.resetToken = null;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch User Profile
            .addCase(fetchUserProfile.pending, (state) => {
                state.profileLoading = true;
                state.profileError = null;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.profileLoading = false;
                state.profile = action.payload;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.profileLoading = false;
                state.profileError = action.payload;
            })
            // Update User Profile
            .addCase(updateUserProfile.pending, (state) => {
                state.profileLoading = true;
                state.profileError = null;
                state.profileUpdateSuccess = false;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.profileLoading = false;
                state.profile = action.payload;
                state.profileUpdateSuccess = true;
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.profileLoading = false;
                state.profileError = action.payload;
                state.profileUpdateSuccess = false;
            })
            // Get User By ID
            .addCase(getUserById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserById.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.user = action.payload.data; 
            })
            .addCase(getUserById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError, clearSuccess, clearOtpStatus, logout, clearProfileStatus } = authSlice.actions;
export default authSlice.reducer;