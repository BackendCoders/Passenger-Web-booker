import { toast } from 'react-hot-toast';
import { endpoints } from '../api';
import { apiConnector } from '../apiConnector';
import {
	setIsAuth,
	setLoading,
	setToken,
	setUser,
} from '../../slices/authSlice';

const { LOGIN_API } = endpoints;



export function login(username, password, navigate) {
	return async (dispatch) => {
		dispatch(setLoading(true));
		try {
			// Simulate API call
			const response = await apiConnector("POST", LOGIN_API, {
				username,
				password,
			});

			if (response.status !== 200) {
				throw new Error(response.data?.message || "Login failed");
			}

			toast.success("Login successful!");

			// Store token and user in Redux
			const { token, user } = response.data;
			dispatch(setToken(token));
			dispatch(setUser(user));
			dispatch(setIsAuth(true));

			// Save token to localStorage
			localStorage.setItem("token", JSON.stringify(token));

			// Navigate to dashboard
			navigate("/");
		} catch (error) {
			dispatch(setIsAuth(false));
			toast.error("Invalid credentials");
		} finally {
			dispatch(setLoading(false));
		}
	};
}



// Ensure refreshToken is declared and exported
export const refreshToken = async () => {
	const response = await fetch('/api/auth/refresh', {
		method: 'POST',
		credentials: 'include', // Include cookies if required
	});
	if (!response.ok) {
		throw new Error('Failed to refresh token');
	}
	return await response.json();
};


export function logout(navigate) {
	return (dispatch) => {
		console.log('LOGOUT');
		dispatch(setToken(null));
		dispatch(setUser(null));
		dispatch(setIsAuth(false));
		localStorage.removeItem('token');
		localStorage.removeItem('hasModalShown');
		toast.success('Logged Out');
		navigate('/');
	};
}


