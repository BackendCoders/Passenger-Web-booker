const BASE_URL = import.meta.env.VITE_BASE_URL;

export const endpoints = {
	SIGNUP_API: `${BASE_URL}/auth/register`,
	LOGIN_API: `${BASE_URL}/auth/login`,
	GET_ME_API: `${BASE_URL}/auth/me`,
	FORGET_PASSWORD_API: `${BASE_URL}/auth/forgetPassword`,
};

export const bookingformEndpoints = {
	GET_ALL_FORMS: `${BASE_URL}/api/Bookings/Create`, // Fetch all forms
	GET_FORM_BY_ID: (id) => `${BASE_URL}/api/Bookings/FindById/${id}`, // Get form by ID
	CREATE_FORM: `${BASE_URL}/api/Bookings/Create`, // Create a new form
	UPDATE_FORM: (id) => `${BASE_URL}/api/Bookings/Update/${id}`, // Update form by ID
	DELETE_FORM: (id) => `${BASE_URL}/api/Bookings/Cancel/${id}`, // Delete form by ID
};