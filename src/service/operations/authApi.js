import { toast } from "react-hot-toast";
import { endpoints } from "../api";
import { apiConnector } from "../apiConnector";
import { setIsAuth, setLoading, setToken, setUser } from "../../slices/authSlice";

const { LOGIN_API } = endpoints;

export function login(userName, password, navigate) {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            // Call API for login
            const response = await apiConnector("POST", LOGIN_API, {
                userName,
                password,
            });

            if (response.status !== 200) {
                throw new Error(response.data?.message || "Login failed");
            }

            toast.success("Login successful!");

            // Extract token and username from API response
            const { token, username } = response.data; 

            // Update Redux Store
            dispatch(setToken(token));
            dispatch(setUser(username)); // Store only username
            dispatch(setIsAuth(true));

            // Save token & username to localStorage
            localStorage.setItem("token", JSON.stringify(token));
            localStorage.setItem("username", JSON.stringify(username)); // Save only username

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
        console.log("LOGOUT");
        dispatch(setToken(null));
        dispatch(setUser(null));
        dispatch(setIsAuth(false));

        // Remove token & username from localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("username"); // Remove username
        localStorage.removeItem("hasModalShown");

        toast.success("Logged Out");
        navigate("/login");
    };
}



