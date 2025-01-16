import { apiConnector } from '../apiConnector';
import { bookingformEndpoints } from '../api';
import { AUTH_TOKEN } from '../authConfig'; // Import the token

const { GET_ALL_FORMS, CREATE_FORM } = bookingformEndpoints;

export const createForm = async (data) => {
	try {
		const payload = {
			request: {
				details: data.details,
				email: data.email,
				durationText: Number(data.durationText)
					? String(data.durationText)
					: '0',
				// durationMinutes: data.durationText ? +data.durationText : 0,
				durationMinutes: data.durationMinutes || 10,
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
				// vias: filterVias(data),
				accountNumber: data.accountNumber || 2222,
				bookedByName: data.bookedByName || '',
				bookingId: data.bookingId || null,
				updatedByName: data.updatedByName || '',
				isASAP: data.isASAP || false,
			},
		};

		const response = await apiConnector('POST', CREATE_FORM, payload, {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${AUTH_TOKEN}`, // Use centralized token
		});

		return response.data; // Return the response data
	} catch (error) {
		console.error('Error submitting form:', error);
		throw error; // Rethrow the error for handling in the calling component
	}
};
