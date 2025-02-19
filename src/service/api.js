const BASE_URL = import.meta.env.VITE_BASE_URL;

export const endpoints = {	
	LOGIN_API: `${BASE_URL}/Auth/Authenticate`,
};

export const newpassengerformEndpoints = {
	GET_ALL_PASSENGERS: (accountNo) => `${BASE_URL}/WeBooking/GetPassengers?accountNo=${accountNo}`, // Fetch all forms
	ADDNEWPASSENGER_CREATE_FORM: `${BASE_URL}/WeBooking/AddNewPassenger`, // Add New passenger form
	DELETE_PASSENGERS: (id) => `${BASE_URL}/WeBooking/DeletePassenger?passengerId=${id}`, // Delete form by ID
};

export const webbookingfromEndpoints = {
	CREATEWEBBOOKING_CREATE_FORM: `${BASE_URL}/WeBooking/CreateWebBooking`, // CREATEWEB BOOKING From 
}

export const getwebbookingEndpoints = { 
	GETWEBBOOKING: `${BASE_URL}/WeBooking/GetWebBookings`, // Get web booking
}

export const getactivebookingEndpoints = {
	GETACTIVEBOOKING: (accountNo) => `${BASE_URL}/WeBooking/GetAccountActiveBookings?accno=${accountNo}`, // Get active booking
	REQUESTAMENDMENT: (bookingId, message) =>`${BASE_URL}/WeBooking/RequestAmendment?bookingId=${bookingId}&message=${message}`,
	REQUESTCANCELLATION: (bookingId) => `${BASE_URL}/WeBooking/RequestCancellation?bookingId=${bookingId}`
};