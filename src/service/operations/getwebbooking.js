/** @format */

import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getwebbookingEndpoints } from "../api";

// ✅ Async Thunk to fetch Web Bookings
export const fetchWebBookings = createAsyncThunk(
  "webbookings/fetchWebBookings",
  async (_, { rejectWithValue }) => {
      try {
          const { data } = await axios.post(getwebbookingEndpoints.GETWEBBOOKING, {
              processed: false,
              accepted: false,
              rejected: false,
          });

          // 🔹 Validate response format in a single check
          if (!Array.isArray(data)) {
              return rejectWithValue("Invalid data format received from server");
          }

          return data;
      } catch (error) {
          console.error("Fetch Web Bookings Error:", error);
          return rejectWithValue(error.response?.data || "Error fetching web bookings");
      }
  }
);
