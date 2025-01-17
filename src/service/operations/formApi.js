/** @format */

// Import necessary modules
import toast from 'react-hot-toast'; // For user notifications
import { apiConnector } from '../apiConnector'; // Custom API wrapper for requests
import { newpassengerformEndpoints } from '../api'; // API endpoint

// Destructure endpoints from bookingformEndpoints for cleaner usage
const {
  GET_ALL_PASSENGERS,
  ADDNEWPASSENGER_CREATE_FORM,
  DELETE_PASSENGERS,
} = newpassengerformEndpoints;

export const getAllPassengers = async (token, accountNo) => {
  try {
    // Making a GET request with authorization headers
    const response = await apiConnector(
      'GET',
      GET_ALL_PASSENGERS(accountNo),
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    console.log('Get All Passengers API Response:', response);
    return response.data; // Return data if API call is successful
  } catch (error) {
    console.error('Get All Passengers API Error:', error);
    toast.error(error.response?.data?.error || 'An error occurred'); // Notify the user
    return []; // Return an empty array on failure
  }
};

export const deletePassenger = async (token, id) => {
  try {
    // Making a DELETE request with authorization headers
    const response = await apiConnector('DELETE', DELETE_PASSENGERS(id), null, {
      Authorization: `Bearer ${token}`,
    });

    console.log('Delete Passenger API Response:', response);
    toast.success('Passenger deleted successfully'); // Notify user on success
    return response.data; // Return the response data
  } catch (error) {
    console.error('Delete Passenger API Error:', error);
    toast.error(error.response?.data?.error || 'An error occurred'); // Notify user on error
    return null; // Return null on failure
  }
};

export const addnewpassengercreateForm = async (token, data) => {
  try {
    // Ensure data is in correct format (e.g., FormData)
    if (!(data instanceof FormData)) {
      throw new Error('Invalid data format. Expected FormData.');
    }

    // Make the POST request
    const response = await apiConnector(
      'POST',
      ADDNEWPASSENGER_CREATE_FORM,
      data,
      {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data', // Required for file uploads
      }
    );

    console.log('Add New Passenger API Response:', response);

    if (!response || !response.data) {
      throw new Error('Unexpected API response');
    }

    toast.success('Passenger added successfully');
    return response.data;
  } catch (error) {
    console.error('Add New Passenger API Error:', error);

    // Improved error message fallback
    toast.error(
      error.response?.data?.error ||
      error.message || 
      'An unexpected error occurred'
    );

    return null;
  }
};

