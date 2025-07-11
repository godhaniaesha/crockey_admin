import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// ==================== AUTHENTICATION ROUTES ====================

// Register new user
export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axios.post('http://localhost:4000/api/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Registration failed' });
        }
    }
);

// Login user
export const login = createAsyncThunk(
    'auth/login',
    async (credentials) => {
        try {
            const response = await axios.post('http://localhost:4000/api/login', credentials);
            console.log(response.data.data, "response");

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data));

            return response.data;
        } catch (error) {
            if (error.response) {
                // The server responded with a status code outside the 2xx range
                throw error.response.data;
            } else if (error.request) {
                // The request was made but no response was received
                throw { message: 'Unable to connect to the server. Please check if the server is running.' };
            } else {
                // Something happened in setting up the request
                throw { message: error.message || 'An error occurred during login.' };
            }
        }
    }
);

// Forgot password - send OTP
export const forgotPassword = createAsyncThunk(
    'auth/forgotPassword',
    async (email, { rejectWithValue }) => {
        try {
            const response = await axios.post('http://localhost:4000/api/forgot-password', { email });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to send OTP' });
        }
    }
);

// Verify OTP for password reset
export const verifyPasswordResetOTP = createAsyncThunk(
    'auth/verifyPasswordResetOTP',
    async ({ email, otp }, { rejectWithValue }) => {
        try {
            const response = await axios.post('http://localhost:4000/api/verify-password-reset-otp', { email, otp });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'OTP verification failed' });
        }
    }
);

// Reset password after OTP verification
export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async ({ email, newPassword, confirmPassword }, { rejectWithValue }) => {
        try {
            const response = await axios.post('http://localhost:4000/api/reset-password', {
                email,
                newPassword,
                confirmPassword,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Password reset failed' });
        }
    }
);

// Change user profile
export const changeProfile = createAsyncThunk(
    'auth/changeProfile',
    async ({ userId, formData }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`http://localhost:4000/api/change-profile/${userId}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Profile update failed' });
        }
    }
);

// Logout user
export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:4000/api/logout', {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return response.data;
        } catch (error) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return rejectWithValue(error.response?.data?.message || 'Logout failed');
        }
    }
);

// Generate new token (refresh token)
export const refreshToken = createAsyncThunk(
    'auth/refreshToken',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:4000/api/refresh-token', {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            localStorage.setItem('token', response.data.token);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Token refresh failed' });
        }
    }
);

// Check authentication
export const checkAuth = createAsyncThunk(
    'auth/checkAuth',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:4000/api/check-auth', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Authentication check failed' });
        }
    }
);

// ==================== USER MANAGEMENT ROUTES (ADMIN ONLY) ====================

// Get all users (admin only)
export const getAllUsers = createAsyncThunk(
    'auth/getAllUsers',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:4000/api/users', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to fetch users' });
        }
    }
);

// Get user by ID (admin only)
export const getUserById = createAsyncThunk(
    'auth/getUserById',
    async (userId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:4000/api/users/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to fetch user' });
        }
    }
);

// Update user (admin only)
export const updateUser = createAsyncThunk(
    'auth/updateUser',
    async ({ userId, formData }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`http://localhost:4000/api/users/${userId}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to update user' });
        }
    }
);

// Delete user (admin only)
export const deleteUser = createAsyncThunk(
    'auth/deleteUser',
    async (userId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`http://localhost:4000/api/users/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to delete user' });
        }
    }
);

// Create user (admin function)
export const createUser = createAsyncThunk(
    'auth/createUser',
    async (formData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:4000/api/create-user', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to create user' });
        }
    }
);

// ==================== SELLER REGISTRATION ROUTES ====================

// Verify GST number
export const verifyGST = createAsyncThunk(
    'auth/verifyGST',
    async (gstNumber, { rejectWithValue }) => {
        try {
            const response = await axios.post('http://localhost:4000/api/verify-gst', { gstNumber });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'GST verification failed' });
        }
    }
);

// Add business details
export const addBusinessDetails = createAsyncThunk(
    'auth/addBusinessDetails',
    async (businessData, { rejectWithValue }) => {
        try {
            const response = await axios.post('http://localhost:4000/api/add-business-details', businessData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to add business details' });
        }
    }
);

// Send OTP for seller verification
export const sendOTP = createAsyncThunk(
    'auth/sendOTP',
    async (phoneNumber, { rejectWithValue }) => {
        try {
            const response = await axios.post('http://localhost:4000/api/send-otp', { phoneNumber });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to send OTP' });
        }
    }
);

// Verify OTP for seller registration
export const verifyOTP = createAsyncThunk(
    'auth/verifyOTP',
    async ({ phoneNumber, otp }, { rejectWithValue }) => {
        try {
            const response = await axios.post('http://localhost:4000/api/verify-otp', { phoneNumber, otp });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'OTP verification failed' });
        }
    }
);

// Add store details
export const addStoreDetails = createAsyncThunk(
    'auth/addStoreDetails',
    async (storeData, { rejectWithValue }) => {
        try {
            const response = await axios.post('http://localhost:4000/api/add-store-details', storeData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to add store details' });
        }
    }
);

// Add bank details
export const addBankDetails = createAsyncThunk(
    'auth/addBankDetails',
    async (bankData, { rejectWithValue }) => {
        try {
            const response = await axios.post('http://localhost:4000/api/add-bank-details', bankData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to add bank details' });
        }
    }
);

// Add pickup address
export const addPickupAddress = createAsyncThunk(
    'auth/addPickupAddress',
    async (addressData, { rejectWithValue }) => {
        try {
            const response = await axios.post('http://localhost:4000/api/add-pickup-address', addressData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to add pickup address' });
        }
    }
);

// Accept terms and conditions
export const acceptTerms = createAsyncThunk(
    'auth/acceptTerms',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.post('http://localhost:4000/api/accept-terms');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to accept terms' });
        }
    }
);

// Get seller registration progress
export const getSellerProgress = createAsyncThunk(
    'auth/getSellerProgress',
    async (userId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:4000/api/seller-progress/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to fetch seller progress' });
        }
    }
);

// ==================== LEGACY FUNCTIONS (KEPT FOR BACKWARD COMPATIBILITY) ====================

// Create Admin User (legacy)
export const createAdminUser = createAsyncThunk(
    'auth/createAdminUser',
    async (formData) => {
        try {
            const response = await axios.post('http://localhost:4000/api/createAdminUser', formData);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
);

// Mobile Number Login (legacy)
export const mobileNoLogin = createAsyncThunk(
    'auth/mobileNoLogin',
    async (mobileNumber) => {
        try {
            const response = await axios.post('http://localhost:4000/api/mobileNoLogin', { mobileNumber });
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
);

// Verify OTP (legacy)
export const verifyOtp = createAsyncThunk(
    'auth/verifyOtp',
    async ({ phone, otp }) => {
        try {
            const response = await axios.post('http://localhost:4000/api/emailOtpVerify', { phone, otp });
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
);

// Generate OTP (legacy)
export const generateOtp = createAsyncThunk(
    'auth/generateOtp',
    async (mobileNo, { rejectWithValue }) => {
        try {
            const response = await axios.post('http://localhost:4000/api/forgotPassword', { mobileNo });
            localStorage.setItem("resetUserId", response.data.userId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Verify Generated OTP (legacy)
export const verifyGeneratedOtp = createAsyncThunk(
    'auth/verifyGeneratedOtp',
    async ({ mobileNumber, otp }) => {
        try {
            const response = await axios.post('http://localhost:4000/api/verifyGenereOtp', { mobileNumber, otp });
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
);

// Resend OTP (legacy)
export const resendOtp = createAsyncThunk(
    'auth/resendOtp',
    async (mobileNumber) => {
        try {
            const response = await axios.post('http://localhost:4000/api/resentOtp', { mobileNumber });
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
);

// Static Resend OTP (legacy)
export const staticResendOtp = createAsyncThunk(
    'auth/staticResendOtp',
    async (mobileNumber) => {
        try {
            const response = await axios.post('http://localhost:4000/api/staticResendotp', { mobileNumber });
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
);

// Reset Password (legacy)
export const resetPasswordLegacy = createAsyncThunk(
    'auth/resetPasswordLegacy',
    async ({ mobileNo, password, confirmPassword }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `http://localhost:4000/api/resetPassword/`,
                {
                    mobileNo: mobileNo,
                    newPassword: password,
                    confirmPassword: confirmPassword,
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Unable to reset password');
        }
    }
);

// Logout User (legacy)
export const userLogout = createAsyncThunk(
    'auth/userLogout',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:4000/api/userLogout', {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }); 
            localStorage.removeItem('token');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Logout failed');
        }
    }
);

// Get User (legacy)
export const getUser = createAsyncThunk(
    'auth/getUser',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:4000/api/getUser', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch user data');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: null,
        loading: false,
        error: null,
        otpSent: false,
        otpVerified: false,
        passwordResetSuccess: false,
        users: [], // For admin user management
        sellerProgress: null, // For seller registration progress
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.otpSent = false;
            state.otpVerified = false;
            state.users = [];
            state.sellerProgress = null;
        },
        clearSellerProgress: (state) => {
            state.sellerProgress = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // ==================== NEW AUTHENTICATION ROUTES ====================

            // Register User
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Registration failed';
            })

            // Login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Forgot Password
            .addCase(forgotPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(forgotPassword.fulfilled, (state) => {
                state.loading = false;
                state.otpSent = true;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to send OTP';
            })

            // Verify Password Reset OTP
            .addCase(verifyPasswordResetOTP.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyPasswordResetOTP.fulfilled, (state) => {
                state.loading = false;
                state.otpVerified = true;
            })
            .addCase(verifyPasswordResetOTP.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'OTP verification failed';
            })

            // Reset Password
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.loading = false;
                state.passwordResetSuccess = true;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Password reset failed';
            })

            // Change Profile
            .addCase(changeProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(changeProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
            })
            .addCase(changeProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Profile update failed';
            })

            // Logout
            .addCase(logout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logout.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.token = null;
                state.otpSent = false;
                state.otpVerified = false;
                state.users = [];
                state.sellerProgress = null;
            })
            .addCase(logout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Refresh Token
            .addCase(refreshToken.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(refreshToken.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
            })
            .addCase(refreshToken.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Token refresh failed';
            })

            // Check Auth
            .addCase(checkAuth.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
            })
            .addCase(checkAuth.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Authentication check failed';
            })

            // ==================== USER MANAGEMENT ROUTES ====================

            // Get All Users
            .addCase(getAllUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload.users;
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch users';
            })

            // Get User By ID
            .addCase(getUserById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserById.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
            })
            .addCase(getUserById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch user';
            })

            // Update User
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to update user';
            })

            // Delete User
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to delete user';
            })

            // Create User
            .addCase(createUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
            })
            .addCase(createUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to create user';
            })

            // ==================== SELLER REGISTRATION ROUTES ====================

            // Verify GST
            .addCase(verifyGST.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyGST.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(verifyGST.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'GST verification failed';
            })

            // Add Business Details
            .addCase(addBusinessDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addBusinessDetails.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(addBusinessDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to add business details';
            })

            // Send OTP
            .addCase(sendOTP.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendOTP.fulfilled, (state) => {
                state.loading = false;
                state.otpSent = true;
            })
            .addCase(sendOTP.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to send OTP';
            })

            // Verify OTP
            .addCase(verifyOTP.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyOTP.fulfilled, (state) => {
                state.loading = false;
                state.otpVerified = true;
            })
            .addCase(verifyOTP.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'OTP verification failed';
            })

            // Add Store Details
            .addCase(addStoreDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addStoreDetails.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(addStoreDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to add store details';
            })

            // Add Bank Details
            .addCase(addBankDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addBankDetails.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(addBankDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to add bank details';
            })

            // Add Pickup Address
            .addCase(addPickupAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addPickupAddress.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(addPickupAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to add pickup address';
            })

            // Accept Terms
            .addCase(acceptTerms.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(acceptTerms.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(acceptTerms.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to accept terms';
            })

            // Get Seller Progress
            .addCase(getSellerProgress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSellerProgress.fulfilled, (state, action) => {
                state.loading = false;
                state.sellerProgress = action.payload.progress;
            })
            .addCase(getSellerProgress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch seller progress';
            })

            // ==================== LEGACY FUNCTIONS ====================

            // Create Admin User (legacy)
            .addCase(createAdminUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(createAdminUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(createAdminUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Mobile Number Login (legacy)
            .addCase(mobileNoLogin.pending, (state) => {
                state.loading = true;
            })
            .addCase(mobileNoLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.otpSent = true;
            })
            .addCase(mobileNoLogin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Verify OTP (legacy)
            .addCase(verifyOtp.pending, (state) => {
                state.loading = true;
            })
            .addCase(verifyOtp.fulfilled, (state, action) => {
                state.loading = false;
                state.otpVerified = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(verifyOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Generate OTP (legacy)
            .addCase(generateOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.otpSent = false;
            })
            .addCase(generateOtp.fulfilled, (state) => {
                state.loading = false;
                state.otpSent = true;
            })
            .addCase(generateOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'An error occurred during OTP generation.';
            })

            // Verify Generated OTP (legacy)
            .addCase(verifyGeneratedOtp.pending, (state) => {
                state.loading = true;
            })
            .addCase(verifyGeneratedOtp.fulfilled, (state, action) => {
                state.loading = false;
                state.otpVerified = true;
            })
            .addCase(verifyGeneratedOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Resend OTP (legacy)
            .addCase(resendOtp.pending, (state) => {
                state.loading = true;
            })
            .addCase(resendOtp.fulfilled, (state) => {
                state.loading = false;
                state.otpSent = true;
            })
            .addCase(resendOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Static Resend OTP (legacy)
            .addCase(staticResendOtp.pending, (state) => {
                state.loading = true;
            })
            .addCase(staticResendOtp.fulfilled, (state) => {
                state.loading = false;
                state.otpSent = true;
            })
            .addCase(staticResendOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Reset Password (legacy)
            .addCase(resetPasswordLegacy.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resetPasswordLegacy.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
                state.passwordResetSuccess = true;
            })
            .addCase(resetPasswordLegacy.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.passwordResetSuccess = false;
            })



            // Get User (legacy)
            .addCase(getUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.data;
            })
            .addCase(getUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearError, logout: logoutAction, clearSellerProgress } = authSlice.actions;
export default authSlice.reducer;