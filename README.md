# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh








/** @format */

import { apiConnector } from '../apiConnector';
import { bookingformEndpoints } from '../api';
import { AUTH_TOKEN } from '../authConfig'; // Import the token

const { GET_ALL_FORMS, CREATE_FORM } = bookingformEndpoints;

// Fetch all forms
export const getAllForms = async () => {
	try {
		const response = await apiConnector('GET', GET_ALL_FORMS, null, {
			Authorization: `Bearer ${AUTH_TOKEN}`, // Use centralized token
		});

		console.log('Get All Forms API Response:', response);
		return response.data;
	} catch (error) {
		console.error('Get All Forms API Error:', error);
		return [];
	}
};

// Create a new form
export const createForm = async (data) => {
	try {
		// Build the payload dynamically
		const payload = {
			request: {
				details: data.details,
		email: data.email,
		durationText: Number(data.durationText) ? String(data.durationText) : '0',
		// durationMinutes: data.durationText ? +data.durationText : 0,
		durationMinutes: data.durationMinutes || 0,
		isAllDay: data.isAllDay,
		passengerName: data.passengerName,
		passengers: data.passengers,
		paymentStatus: data.paymentStatus || 0,
		scope: data.scope,
		phoneNumber: data.phoneNumber,
		pickupAddress: data.pickupAddress,
		pickupDateTime: data.pickupDateTime,
		pickupPostCode: data.pickupPostCode,
		destinationAddress: data.destinationAddress,
		destinationPostCode: data.destinationPostCode,
		recurrenceRule: data.recurrenceRule || null,
		recurrenceID: data.recurrenceID || null,
		price: data.price,
		priceAccount: data.priceAccount || 0,
		chargeFromBase: data.chargeFromBase || false,
		userId: data.userId || null,
		returnDateTime: data.returnDateTime || null,
		vias: filterVias(data),
		accountNumber: data.accountNumber,
		bookedByName: data.bookedByName || '',
		bookingId: data.bookingId || null,
		updatedByName: data.updatedByName || '',
		isASAP: data.isASAP || false,
		// actionByUserId: data.actionByUserId || null,
			},
		};

		// Log payload for debugging
		console.log('Payload being submitted:', payload);

		// Make the POST request
		const response = await apiConnector('POST', CREATE_FORM, payload, {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${AUTH_TOKEN}`, // Use centralized token
		});

		console.log('Form submitted successfully:', response.data);

		return response.data; // Return the response data
	} catch (error) {
		console.error('Error submitting form:', error);
		throw error; // Rethrow the error for handling in the calling component
	}
};
