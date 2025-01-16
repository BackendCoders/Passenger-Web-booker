/** @format */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import carlogo from "../../assets/acelogo.png"; // Ensure this path is correct

const LoginForm = () => {
	const [formData, setFormData] = useState({
		accountNumber: "",
		username: "",
		password: "",
	});
	const navigate = useNavigate();

	// Handle input changes
	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	// Handle form submission
	const handleSubmit = (e) => {
		e.preventDefault();

		// Validation for empty fields
		if (!formData.accountNumber || !formData.username || !formData.password) {
			toast.error("All fields are required!");
			return;
		}

		// Simulate login success
		toast.success("Login successful!");
		navigate("/dashboard"); // Replace "/dashboard" with the desired route
	};

	return (
		<div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-500 to-blue-800 px-4">
			<div className="w-full max-w-md bg-white shadow-md rounded-lg overflow-hidden">
				<div className="p-6">
					{/* Logo Section */}
					<div className="flex justify-center mb-6">
						<img
							src={carlogo}
							alt="Car Logo"
							className="w-16 h-16"
						/>
					</div>

					<h2 className="text-2xl font-bold text-center text-blue-700 mb-4">
						ACE TAXIS - ACCOUNT LOGIN
					</h2>

					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label
								htmlFor="accountNumber"
								className="block text-gray-600 font-medium mb-1"
							>
								Account Number:
							</label>
							<input
								type="text"
								name="accountNumber"
								placeholder="Enter your account number"
								className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
								value={formData.accountNumber}
								onChange={handleChange}
								required
							/>
						</div>

						<div>
							<label
								htmlFor="username"
								className="block text-gray-600 font-medium mb-1"
							>
								Username:
							</label>
							<input
								type="text"
								name="username"
								placeholder="Enter your username"
								className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
								value={formData.username}
								onChange={handleChange}
								required
							/>
						</div>

						<div>
							<label
								htmlFor="password"
								className="block text-gray-600 font-medium mb-1"
							>
								Password:
							</label>
							<input
								type="password"
								name="password"
								placeholder="Enter your password"
								className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
								value={formData.password}
								onChange={handleChange}
								required
							/>
						</div>

						<button
							type="submit"
							className="w-full bg-blue-700 text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition duration-300"
						>
							Login
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default LoginForm;
