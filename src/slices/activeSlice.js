import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getActiveBookings, requestAmendment, requestCancellation } from "../service/operations/activebookings";

const initialState = {
    activeBookings: [],
    loading: false,
    error: null,
    success: null,
};

// 🔥 Fetch Active Bookings (Async Thunk)
export const fetchActiveBookings = createAsyncThunk(
    "activebookings/fetchActiveBookings",
    async (_, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token; // Get Token from Redux
            const accountNo = getState().auth.username; // Get Account Number

            if (!token) throw new Error("Authentication failed. Please log in again.");

            const response = await getActiveBookings(token, accountNo);
            return response;
        } catch (error) {
            console.error("Fetch Active Bookings Error:", error);
            return rejectWithValue(error.response?.data?.error || "Failed to fetch active bookings");
        }
    }
);

// 🔥 Request Amendment (Async Thunk)
export const amendBooking = createAsyncThunk(
    "activebookings/amendBooking",
    async ({ bookingId, message }, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token;
            if (!token) throw new Error("Authentication failed. Please log in again.");

            const response = await requestAmendment(token, bookingId, message);
            return { bookingId, updatedData: response };
        } catch (error) {
            console.error("Amend Booking Error:", error);
            return rejectWithValue(error.response?.data?.error || "Failed to amend booking");
        }
    }
);

// 🔥 Request Cancellation (Async Thunk)
export const cancelBooking = createAsyncThunk(
    "activebookings/cancelBooking",
    async (bookingId, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token;
            if (!token) throw new Error("Authentication failed. Please log in again.");

            await requestCancellation(token, bookingId);
            return bookingId;
        } catch (error) {
            console.error("Cancel Booking Error:", error);
            return rejectWithValue(error.response?.data?.error || "Failed to cancel booking");
        }
    }
);

const activeSlice = createSlice({
    name: "activebookings",
    initialState,
    reducers: {
        resetStatus: (state) => {
            state.success = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Active Bookings
            .addCase(fetchActiveBookings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchActiveBookings.fulfilled, (state, action) => {
                state.loading = false;
                state.activeBookings = action.payload;
            })
            .addCase(fetchActiveBookings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Amend Booking
            .addCase(amendBooking.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(amendBooking.fulfilled, (state, action) => {
                state.loading = false;
                state.success = "Booking amended successfully!";
                const index = state.activeBookings.findIndex(b => b.id === action.payload.bookingId);
                if (index !== -1) {
                    state.activeBookings[index] = { ...state.activeBookings[index], ...action.payload.updatedData };
                }
            })
            .addCase(amendBooking.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Cancel Booking
            .addCase(cancelBooking.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(cancelBooking.fulfilled, (state, action) => {
                state.loading = false;
                state.success = "Booking cancelled successfully!";
                state.activeBookings = state.activeBookings.filter(b => b.id !== action.payload);
            })
            .addCase(cancelBooking.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetStatus } = activeSlice.actions;
export default activeSlice.reducer;
