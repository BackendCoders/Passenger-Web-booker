import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import webbookingApi from '../service/operations/webbookingApi';

// Async Thunk for API Call
export const createWebBooking = createAsyncThunk(
  'webbooking/createWebBooking',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await webbookingApi.createWebBooking(formData);
      return response; // Success response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Something went wrong'); // Handle error
    }
  }
);

// Slice Definition
const webbookingSlice = createSlice({
  name: 'webbooking',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createWebBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createWebBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(createWebBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default webbookingSlice.reducer;
