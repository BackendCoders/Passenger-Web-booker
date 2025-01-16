/** @format */

// Import required functions from Redux Toolkit
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Import service functions for API calls
import {
  getAllPassengers,
  addnewpassengercreateForm,
  deletePassenger,
} from "../service/operations/formApi";

/**
 * Async Thunk: Fetch all passengers from the API.
 */
export const fetchPassengers = createAsyncThunk(
  "forms/fetchPassengers",
  async (_, { rejectWithValue }) => {
    try {
      const token = "static-token"; // Replace with your actual token
      const accountNo = 9999; // Static account number
      const response = await getAllPassengers(token, accountNo); // API call
      return response; // Return passenger list
    } catch (error) {
      console.error("Fetch Passengers Error:", error);
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch passengers"
      );
    }
  }
);

/**
 * Async Thunk: Add a new passenger to the system.
 */
export const addPassenger = createAsyncThunk(
  "forms/addPassenger",
  async ({ token, data }, { rejectWithValue }) => {
    try {
      const response = await addnewpassengercreateForm(token, data); // API call

      if (!response || typeof response !== "object") {
        throw new Error("Invalid API response");
      }

      console.log("Add Passenger API Response:", response);
      return response; // Return API response
    } catch (error) {
      console.error("Add Passenger Error:", error.message);
      return rejectWithValue(
        error.response?.data?.error || "Failed to add passenger"
      );
    }
  }
);

/**
 * Async Thunk: Delete a passenger by ID.
 */
export const removePassenger = createAsyncThunk(
  "forms/removePassenger",
  async ({ token, id }, { rejectWithValue }) => {
    try {
      const response = await deletePassenger(token, id); // API call

      if (!response || typeof response !== "object") {
        throw new Error("Invalid API response");
      }

      console.log("Delete Passenger API Response:", response);
      return id; // Return deleted passenger ID
    } catch (error) {
      console.error("Delete Passenger Error:", error.message);
      return rejectWithValue(
        error.response?.data?.error || "Failed to delete passenger"
      );
    }
  }
);

/**
 * Slice: Manages form and passenger-related state and actions.
 */
const formSlice = createSlice({
  name: "forms",
  initialState: {
    passengers: [], // List of passengers
    forms: [], // Forms array
    selectedPassenger: null, // Selected passenger for editing or viewing
    loading: false, // Loading state
    success: null, // Success message
    error: null, // Error message
  },

  reducers: {
    updateForm: (state, action) => {
      const index = state.forms.findIndex((form) => form.id === action.payload.id);
      if (index !== -1) {
        state.forms[index] = { ...state.forms[index], ...action.payload };
      }
    },
    setSelectedPassenger: (state, action) => {
      state.selectedPassenger = action.payload;
    },
    resetStatus: (state) => {
      state.success = null;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Fetch Passengers
      .addCase(fetchPassengers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPassengers.fulfilled, (state, action) => {
        state.loading = false;
        state.passengers = action.payload;
      })
      .addCase(fetchPassengers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Passenger
      .addCase(addPassenger.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(addPassenger.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Passenger added successfully!";
        state.passengers.push(action.payload);
      })
      .addCase(addPassenger.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Remove Passenger
      .addCase(removePassenger.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(removePassenger.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Passenger deleted successfully!";
        state.passengers = state.passengers.filter(
          (passenger) => passenger.id !== action.payload
        );
      })
      .addCase(removePassenger.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export reducers and actions
export const { updateForm, setSelectedPassenger, resetStatus } = formSlice.actions;
export default formSlice.reducer;
