/** @format */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	forms: [], // All forms
	form: {
		// Location Form Fields
		pickupAddress: '',
		destinationAddress: '',
		pickupDateTime: '',// Vehicle Selection Form Field
		passengers: '', // Booking Details Form Fields
		bookedByName: '',
		email: '',
		phoneNumber: '',
	},
	loading: false,
	error: null, // Optional: for error handling
};

const formSlice = createSlice({
	name: 'forms',
	initialState,
	reducers: {
		setLoading: (state, action) => {
			state.loading = action.payload;
		},
		setForms: (state, action) => {
			state.forms = action.payload;
			state.loading = false;
		},
		setForm: (state, action) => {
			state.form = action.payload;
			state.loading = false;
		},
		addForm: (state, action) => {
			state.forms.push(action.payload);
			state.loading = false;
		},
		updateForm: (state, action) => {
			const index = state.forms.findIndex(
				(form) => form.id === action.payload.id
			);
			if (index !== -1) state.forms[index] = action.payload;
			state.loading = false;
		},
		removeForm: (state, action) => {
			state.forms = state.forms.filter((form) => form.id !== action.payload);
			state.loading = false;
		},
		setError: (state, action) => {
			state.error = action.payload;
			state.loading = false;
		},
		setVehicleDetails: (state, action) => {
			state.form.passengers = action.payload.passengers; // Update passengers
		},
		updateFormData: (state, action) => {
			state.form = {
				...state.form,
				...action.payload, // Merge new form data
			};
		},
		resetFormData: (state) => {
			state.form = initialState.form; // Reset form data
		},
	},
});

// Fetch all forms without token
export function fetchAllForms() {
	return async (dispatch) => {
		try {
			dispatch(setLoading(true));
			const response = await getAllForms(); // Call the API without token

			console.log('Fetched All Forms:', response);
			dispatch(setForms(response));
		} catch (error) {
			console.error('Failed to fetch forms:', error);
			dispatch(setError(error.message || 'An error occurred'));
		}
	};
}

export const {
	setLoading,
	setForms,
	setForm,
	addForm,
	updateForm,
	removeForm,
	setError,
	setVehicleDetails,
	updateFormData, // Export the new action
	resetFormData, // Export reset action
} = formSlice.actions;

export default formSlice.reducer;
