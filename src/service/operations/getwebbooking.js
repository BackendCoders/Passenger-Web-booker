/** @format */

import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getwebbookingEndpoints } from "../api";

// ✅ Async Thunk to fetch Web Bookings
export const fetchWebBookings = createAsyncThunk(
    "webbookings/fetchWebBookings",
    async (_, { rejectWithValue }) => {
      try {
        const response = await axios.post(getwebbookingEndpoints.GETWEBBOOKING, {
          processed: false,
          accepted: false,
          rejected: false,
        });
  
        if (!response.data || !Array.isArray(response.data)) {
          return rejectWithValue("Invalid data format");
        }
  
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || "Error fetching data");
      }
    }
  );
  
