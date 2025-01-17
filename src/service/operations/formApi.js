import { apiConnector } from '../apiConnector'; // API connector utility
import { newpassengerformEndpoints } from '../api'; // Endpoints

const {
  GET_ALL_PASSENGERS,
  ADDNEWPASSENGER_CREATE_FORM,
  DELETE_PASSENGERS,
} = newpassengerformEndpoints;

// Fetch all passengers
export const getAllPassengers = async (token, accountNo) => {
  try {
    const response = await apiConnector('GET', GET_ALL_PASSENGERS(accountNo), null, {
      Authorization: `Bearer ${token}`,
    });
    if (response.status !== 200) throw new Error('Could not fetch passengers');
    return response.data;
  } catch (error) {
    console.error('Get all passengers error:', error.response?.data || error.message);
    toast.error(error.response?.data?.error || 'Failed to fetch passengers');
  }
};

// Add a new passenger
export const addNewPassenger = async (token, data) => {
  try {
    const response = await apiConnector('POST', ADDNEWPASSENGER_CREATE_FORM, data, {
      Authorization: `Bearer ${token}`,
    });
    if (response.status !== 201) throw new Error("Couldn't create a new passenger");
    toast.success('New passenger added successfully');
    return response.data;
  } catch (error) {
    console.error('Add new passenger error:', error.response?.data || error.message);
    toast.error(error.response?.data?.error || 'Failed to add passenger');
  }
};

// Delete a passenger by ID
export const deletePassenger = async (token, id) => {
  try {
    const response = await apiConnector('DELETE', DELETE_PASSENGERS(id), null, {
      Authorization: `Bearer ${token}`,
    });
    if (response.status !== 200) throw new Error('Could not delete passenger');
    toast.success('Passenger deleted successfully');
    return id;
  } catch (error) {
    console.error('Delete passenger error:', error.response?.data || error.message);
    toast.error(error.response?.data?.error || 'Failed to delete passenger');
  }
};
