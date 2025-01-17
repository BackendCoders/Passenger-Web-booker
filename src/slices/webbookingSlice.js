/** @format */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createActionPlan } from "../service/operations/webbookingApi"; // Import the API function

/**
 * Async Thunk: Create a new action plan
 */
export const createActionPlanThunk = createAsyncThunk(
  "actionPlan/create",
  async ({ token, webBookingData }, { rejectWithValue }) => {
    try {
      // Call the API function
      const response = await createActionPlan(token, webBookingData);
      return response; // Return the response data
    } catch (error) {
      // Reject with an error message
      return rejectWithValue(
        error.response?.data?.error || error.message || "Failed to create action plan"
      );
    }
  }
);

/**
 * Slice: Manages the action plan creation state
 */
const actionPlanSlice = createSlice({
  name: "actionPlan",
  initialState: {
    loading: false, // Loading state for the POST request
    success: null, // Success message
    error: null, // Error message
  },
  reducers: {
    resetStatus: (state) => {
      state.success = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Pending State
      .addCase(createActionPlanThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      // Fulfilled State
      .addCase(createActionPlanThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Action plan created successfully!";
        state.error = null;
      })
      // Rejected State
      .addCase(createActionPlanThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create action plan";
        state.success = null;
      });
  },
});

// Export the reducer and actions
export const { resetStatus } = actionPlanSlice.actions;
export default actionPlanSlice.reducer;
