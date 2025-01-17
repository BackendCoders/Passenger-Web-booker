import { webbookingfromEndpoints } from "../api";
import { apiConnector } from "../apiConnector";
import toast from "react-hot-toast";

// Destructure API endpoints for cleaner usage
const { CREATEWEBBOOKING_CREATE_FORM } = webbookingfromEndpoints;

export const createActionPlan = async (token, webBookingData) => {
  try {
    const response = await apiConnector(
      "POST",
      CREATEWEBBOOKING_CREATE_FORM,
      webBookingData,
      {
        Authorization: `Bearer ${token}`, // Sanitize the token
      }
    );

    // Handle success based on status code
    if (response.status === 201 || response.status === 200) {
      toast.success("Action plan created successfully!"); // Show success toast
      return response.data; // Return the response data
    } else {
      throw new Error(
        response?.data?.message || "Failed to create action plan"
      );
    }
  } catch (error) {
    // Handle the error with a helper function
    handleError(error, "Failed to create action plan");
  }
};

const handleError = (error, defaultMessage) => {
  console.error("API Error:", error);
  const errorMessage =
    error.response?.data?.error || error.message || defaultMessage;
  toast.error(errorMessage); // Show error toast
};
