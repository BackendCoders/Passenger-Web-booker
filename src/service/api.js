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