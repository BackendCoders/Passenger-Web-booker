import { apiConnector } from "../apiConnector"; // API connector utility
import { getactivebookingEndpoints } from "../api"; // API Endpoints

const { GETACTIVEBOOKING, REQUESTAMENDMENT, REQUESTCANCELLATION } = getactivebookingEndpoints;

// 🔥 Fetch Active Bookings
export const getActiveBookings = async (token, accountNo) => {
    try {
        const response = await apiConnector('GET', GETACTIVEBOOKING(accountNo), null, {
            Authorization: `Bearer ${token}`,
          });
        if (response.status !== 200) throw new Error("Could not fetch active bookings");

        return response.data;
    } catch (error) {
        console.error("Get active bookings error:", error.response?.data || error.message);
        throw error;
    }
};

// 🔥 Request Amendment
export const requestAmendment = async (token, bookingId, message) => {
    try {
        const response = await apiConnector('GET', REQUESTAMENDMENT(bookingId, message), null, {
           
            Authorization: `Bearer ${token}`,
          });
        if (response.status !== 200) throw new Error("Failed to request amendment");

        return response.data;
    } catch (error) {
        console.error("Amendment request error:", error.response?.data || error.message);
        throw error;
    }
};

// 🔥 Request Cancellation
export const requestCancellation = async (token, bookingId) => {
    try {
        const response = await apiConnector("GET", REQUESTCANCELLATION(bookingId), null, {
            
            Authorization: `Bearer ${token}`,
          });
        if (response.status !== 200) throw new Error("Failed to request cancellation");

        return response.data;
    } catch (error) {
        console.error("Cancellation request error:", error.response?.data || error.message);
        throw error;
    }
};
