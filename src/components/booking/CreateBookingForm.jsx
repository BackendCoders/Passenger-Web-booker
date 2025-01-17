/** @format */

// Importing necessary hooks and libraries
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
	getAddressSuggestions,
	getAddressDetails,
} from '../../utils/addressAPI'; // Utility functions for address handling
import { LuArrowDownUp } from 'react-icons/lu'; // Importing switch icon
import Header from '../Common/header'; // Header component
import { updateForm } from '../../slices/formSlice'; // Redux action to update form data
import { TiArrowBack } from 'react-icons/ti';
import { fetchPassengers } from '../../slices/formSlice';

// Main functional component for creating a booking form
function CreateBookingForm() {
	const dispatch = useDispatch(); // Redux dispatch function
	const navigate = useNavigate(); // React Router function for navigation

	// Use the passengers array from Redux store dynamically
	const { passengers = [] } = useSelector((state) => state.forms);

	const formData = useState();

	// Fetch passengers when the component mounts
	useEffect(() => {
		if (passengers.length === 0) {
			dispatch(fetchPassengers());
		}
	}, [dispatch, passengers.length]);

	// Map and transform passengers if needed
	const existingPassengers = passengers.map((passenger) => ({
		id: passenger.id,
		name: passenger.passenger || 'N/A', // Assuming the name field is called 'passenger'
		address: passenger.address || 'N/A',
		postcode: passenger.postcode || 'N/A',
	}));

	// States for date and time management
	const [currentDateTime, setCurrentDateTime] = useState(''); // Current datetime state
	const [returnDateTime, setReturnDateTime] = useState(''); // Return datetime state

	// useEffect to initialize current and return date/time
	useEffect(() => {
		// Function to get the current date and time in the required format
		const getCurrentDateTime = () => {
			const now = new Date();
			const year = now.getFullYear();
			const month = String(now.getMonth() + 1).padStart(2, '0'); // Add leading zero to month
			const day = String(now.getDate()).padStart(2, '0'); // Add leading zero to date
			const hours = String(now.getHours()).padStart(2, '0'); // Add leading zero to hours
			const minutes = String(now.getMinutes()).padStart(2, '0'); // Add leading zero to minutes

			// Format: YYYY-MM-DDTHH:MM
			return `${year}-${month}-${day}T${hours}:${minutes}`;
		};

		// Set the current and return date/time states
		setCurrentDateTime(getCurrentDateTime());
		setReturnDateTime(getCurrentDateTime());
	}, []);

	// States for pickup and destination details
	const [pickupAddress, setPickupAddress] = useState(
		formData?.pickupAddress || '' // Use optional chaining and a default value
	);

	const [pickupPostCode, setPickupPostCode] = useState(''); // Pickup postcode state
	const [destinationAddress, setDestinationAddress] = useState(
		formData?.destinationAddress || '' // Prefill from Redux or set as empty
	);
	const [destinationPostCode, setDestinationPostCode] = useState(''); // Destination postcode state
	const [pickupDate, setPickupDate] = useState(
		formData?.pickupDateTime // Prefill pickup date from Redux or default to current date
			? formData?.pickupDateTime.split(' ')[0] // Extract date
			: new Date().toISOString().slice(0, 10) // Default to current date in YYYY-MM-DD format
	);
	const [pickupTime, setPickupTime] = useState(
		formData?.pickupDateTime // Prefill pickup time from Redux or default to current time
			? formData?.pickupDateTime.split(' ')[1] // Extract time
			: new Date().toLocaleTimeString('en-US', { hour12: false }).slice(0, 5) // Default to current time in HH:MM format
	);

	// States for other form details
	const [passengerscount, setPassengers] = useState(1); // Number of passengers state
	const [name, setName] = useState(''); // Name state
	const [email, setEmail] = useState(''); // Email state
	const [phone, setPhone] = useState(''); // Phone number state
	const [bookingdetails, setBookingdetails] = useState(''); // bookingdetails 

	// States for address suggestions
	const [pickupSuggestions, setPickupSuggestions] = useState([]); // Suggestions for pickup address
	const [destinationSuggestions, setDestinationSuggestions] = useState([]); // Suggestions for destination address

	// State for return trip toggle
	const [isReturn, setIsReturn] = useState(false); // Whether return trip is enabled

	const [viewMode, setViewMode] = useState('address'); // "address" or "existing"
	const [destiMode, setDestiMode] = useState('address');

	// Function to handle selecting an existing passenger
	const handleExistingPassengerSelect = (passengerId, mode) => {
		const selectedPassenger = existingPassengers.find(
			(passenger) => passenger.id === passengerId
		);

		if (selectedPassenger) {
			if (mode === 'pickup') {
				// Fill pickup address and postcode
				setPickupAddress(selectedPassenger.address);
				setPickupPostCode(selectedPassenger.postcode);

				// Automatically switch to "Address" mode
				setViewMode('address');
			} else if (mode === 'destination') {
				// Fill destination address and postcode
				setDestinationAddress(selectedPassenger.address);
				setDestinationPostCode(selectedPassenger.postcode);

				// Automatically switch to "Address" mode
				setDestiMode('address');
			}
		}
	};

	// Function to toggle return trip
	const handleReturnToggle = () => {
		setIsReturn(!isReturn); // Toggle the return trip state
	};

	// Fetch address suggestions as the user types
	const fetchSuggestions = async (value, isPickup = true) => {
		if (value.length > 2) {
			// Only fetch suggestions for input longer than 2 characters
			const suggestions = await getAddressSuggestions(value); // Fetch suggestions
			if (isPickup) {
				setPickupSuggestions(suggestions); // Update pickup suggestions
			} else {
				setDestinationSuggestions(suggestions); // Update destination suggestions
			}
		} else {
			// Clear suggestions if input is too short
			if (isPickup) setPickupSuggestions([]);
			else setDestinationSuggestions([]);
		}
	};

	// Handle address selection from suggestions
	const handleSelectAddress = async (id, isPickup = true) => {
		const details = await getAddressDetails(id); // Fetch address details by ID
		if (isPickup) {
			setPickupAddress(details.address); // Update pickup address
			setPickupPostCode(details.postcode); // Update pickup postcode
			setPickupSuggestions([]); // Clear pickup suggestions
		} else {
			setDestinationAddress(details.address); // Update destination address
			setDestinationPostCode(details.postcode); // Update destination postcode
			setDestinationSuggestions([]); // Clear destination suggestions
		}
	};

	// Switch pickup and destination details
	const handleSwitch = () => {
		setPickupAddress(destinationAddress); // Switch addresses
		setDestinationAddress(pickupAddress);
		setPickupPostCode(destinationPostCode); // Switch postcodes
		setDestinationPostCode(pickupPostCode);
	};

	// Handle form submission
	const handleSubmit = () => {
		if (!pickupAddress || !pickupDate || !pickupTime) {
			// Validate required fields
			alert('Please fill in all required fields.');
			return;
		}

		// Prepare booking details
		const bookingDetails = {
			pickupAddress,
			pickupPostCode,
			destinationAddress,
			destinationPostCode,
			pickupDateTime: `${pickupDate} ${pickupTime}`, // Combine date and time
			passengers,
			bookingdetails,
			name,
			email,
			phone,
		};

		// Dispatch the form data to Redux
		dispatch(updateForm(bookingDetails));

		// Navigate to the next step
		navigate('/confirmation');
	};

	// Navigate back to the dashboard
	const backhistory = () => {
		navigate('/dashboard');
	};

	return (
		<div>
			<Header />

			<div className='flex justify-center px-4 py-4 sm:py-4 sm:px-4 bg-gradient-to-br from-red-50 to-red-100 overflow-y-auto h-[95vh]'>
				<div className='bg-gradient-to-br from-red-50 to-red-100 bg-opacity-90 p-4 sm:p-8 rounded-xl w-full max-w-4xl  h-[110vh]'>
					<button
						onClick={backhistory}
						className='bg-red-500 text-white py-1 px-5 mb-4 rounded-lg hover:from-red-600 hover:to-red-500 transition-all duration-300 shadow-md flex items-center'
					>
						<TiArrowBack className='mr-2' />
						<span>Back</span>
					</button>

					{/* Date and ASAP */}
					<div className='flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 mb-4 sm:mb-6'>
						<div className='flex flex-col sm:flex-row items-center gap-2 sm:gap-4'>
							<input
								type='datetime-local'
								value={currentDateTime}
								onChange={(e) => setCurrentDateTime(e.target.value)}
								className='w-full sm:w-auto p-2 bg-white border border-red-500 rounded-md sm:rounded-lg text-sm focus:ring-2 focus:ring-red-500'
							/>
							{isReturn && (
								<input
									type='datetime-local'
									value={returnDateTime}
									onChange={(e) => setReturnDateTime(e.target.value)}
									className='w-full sm:w-auto p-2 bg-white border border-red-500 rounded-md sm:rounded-lg text-sm focus:ring-2 focus:ring-red-500'
								/>
							)}
						</div>
						<div className='flex items-center gap-2 sm:gap-4 w-full sm:w-auto'>
							<button className='w-full sm:w-auto bg-red-500 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm hover:from-red-600 hover:to-red-500 transition-all duration-300'>
								Repeat Booking
							</button>
							<label className='flex items-center gap-1 sm:gap-2 text-gray-700 cursor-pointer text-xs sm:text-sm'>
								<div
									className={`relative w-8 h-5 sm:w-10 sm:h-6 rounded-full ${
										isReturn ? 'bg-red-500' : 'bg-gray-300'
									}`}
									onClick={handleReturnToggle}
								>
									<div
										className={`absolute w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full shadow-md top-[2px] sm:top-1 left-[2px] transform transition-transform duration-300 ${
											isReturn
												? 'translate-x-4 sm:translate-x-4'
												: 'translate-x-0'
										}`}
									></div>
								</div>
								<span>Return</span>
							</label>
						</div>
					</div>

					{/* Buttons for Address and Existing Passenger */}
					<div className='flex gap-4 mb-4'>
						<button
							onClick={() => setViewMode('address')}
							className={`px-4 py-2 rounded ${
								viewMode === 'address'
									? 'bg-red-500 text-white'
									: 'bg-gray-200 text-gray-700'
							} hover:bg-red-600 transition-all duration-300`}
						>
							Address
						</button>
						<button
							onClick={() => setViewMode('existing')}
							className={`px-4 py-2 rounded ${
								viewMode === 'existing'
									? 'bg-red-500 text-white'
									: 'bg-gray-200 text-gray-700'
							} hover:bg-red-600 transition-all duration-300`}
						>
							Existing Passenger
						</button>
					</div>

					{/* Pickup Address and Post Code */}
					{viewMode === 'address' && (
						<div className='grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mb-2 sm:mb-4'>
							{/* Pickup Address */}
							<div>
								<label className='block text-xs sm:text-sm font-medium text-gray-700 mb-1'>
									Pickup Address <span className='text-red-500'>*</span>
								</label>
								<div className='relative'>
									<input
										type='text'
										placeholder='Pickup Address'
										value={pickupAddress}
										onChange={(e) => {
											setPickupAddress(e.target.value);
											fetchSuggestions(e.target.value, true);
										}}
										className='w-full px-3 sm:px-4 py-2 sm:py-3 rounded-md sm:rounded-lg bg-white border border-gray-300 text-xs sm:text-sm'
									/>
									{/* Suggestions Dropdown */}
									{pickupSuggestions.length > 0 && (
										<ul className='absolute z-10 bg-white border border-gray-300 rounded shadow-lg max-h-40 overflow-y-auto w-full mt-1'>
											{pickupSuggestions.map((suggestion) => (
												<li
													key={suggestion.id}
													onClick={() =>
														handleSelectAddress(suggestion.id, true)
													}
													className='px-3 sm:px-4 py-2 hover:bg-gray-100 cursor-pointer text-xs sm:text-sm'
												>
													{suggestion.label}
												</li>
											))}
										</ul>
									)}
								</div>
							</div>

							{/* Post Code */}
							<div>
								<label className='block text-xs sm:text-sm font-medium text-gray-700 mb-1'>
									Post Code
								</label>
								<input
									type='text'
									placeholder='Post Code'
									value={pickupPostCode}
									onChange={(e) => setPickupPostCode(e.target.value)}
									className='w-full px-3 sm:px-4 py-2 sm:py-3 rounded-md sm:rounded-lg bg-white border border-gray-300 text-xs sm:text-sm'
								/>
							</div>
						</div>
					)}
					{/* Existing Passenger Dropdown */}
					{viewMode === 'existing' && (
						<div className='mb-4'>
							<label className='block text-xs sm:text-sm font-medium text-gray-700 mb-1'>
								Select Existing Passenger
							</label>
							<select
								id='pickupPassenger'
								onChange={(e) =>
									handleExistingPassengerSelect(
										Number(e.target.value),
										'pickup'
									)
								}
								className='w-full px-3 sm:px-4 py-2 sm:py-3 rounded-md sm:rounded-lg bg-white border border-gray-300 text-xs sm:text-sm'
							>
								<option value=''>-- Select Passenger --</option>
								{existingPassengers.map((passenger) => (
									<option
										key={passenger.id}
										value={passenger.id}
									>
										{passenger.name} - {passenger.address}
									</option>
								))}
							</select>
						</div>
					)}

					<div className='text-center'>
						<button
							onClick={handleSwitch}
							className='p-2 text-red-600'
						>
							<LuArrowDownUp />
						</button>
					</div>

					{/* Buttons for Address and Existing Passenger */}
					<div className='flex gap-4 mb-4'>
						<button
							onClick={() => setDestiMode('address')}
							className={`px-4 py-2 rounded ${
								destiMode === 'address'
									? 'bg-red-500 text-white'
									: 'bg-gray-200 text-gray-700'
							} hover:bg-red-600 transition-all duration-300`}
						>
							Address
						</button>
						<button
							onClick={() => setDestiMode('existing')}
							className={`px-4 py-2 rounded ${
								destiMode === 'existing'
									? 'bg-red-500 text-white'
									: 'bg-gray-200 text-gray-700'
							} hover:bg-red-600 transition-all duration-300`}
						>
							Existing Passenger
						</button>
					</div>

					{/* Destination Address */}
					{destiMode === 'address' && (
						<div className='grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mb-2 sm:mb-4'>
							{/* Destination Address */}
							<div>
								<label className='block text-xs sm:text-sm font-medium text-gray-700 mb-1'>
									Destination Address <span className='text-red-500'>*</span>
								</label>
								<div className='relative'>
									<input
										type='text'
										placeholder='Destination Address'
										value={destinationAddress}
										onChange={(e) => {
											setDestinationAddress(e.target.value);
											fetchSuggestions(e.target.value, false);
										}}
										className='w-full px-3 sm:px-4 py-2 sm:py-3 rounded-md sm:rounded-lg bg-white border border-gray-300 text-xs sm:text-sm'
									/>
									{/* Suggestions Dropdown */}
									{destinationSuggestions.length > 0 && (
										<ul className='absolute z-10 bg-white border border-gray-300 rounded shadow-lg max-h-40 overflow-y-auto w-full mt-1'>
											{destinationSuggestions.map((suggestion) => (
												<li
													key={suggestion.id}
													onClick={() =>
														handleSelectAddress(suggestion.id, false)
													}
													className='px-3 sm:px-4 py-2 hover:bg-gray-100 cursor-pointer text-xs sm:text-sm'
												>
													{suggestion.label}
												</li>
											))}
										</ul>
									)}
								</div>
							</div>

							{/* Destination Post Code */}
							<div>
								<label className='block text-xs sm:text-sm font-medium text-gray-700 mb-1'>
									Post Code
								</label>
								<input
									type='text'
									placeholder='Post Code'
									value={destinationPostCode}
									onChange={(e) => setDestinationPostCode(e.target.value)}
									className='w-full px-3 sm:px-4 py-2 sm:py-3 rounded-md sm:rounded-lg bg-white border border-gray-300 text-xs sm:text-sm'
								/>
							</div>
						</div>
					)}
					{/* Existing Passenger Dropdown */}
					{destiMode === 'existing' && (
						<div className='mb-4'>
							<label className='block text-xs sm:text-sm font-medium text-gray-700 mb-1'>
								Select Existing Passenger
							</label>
							<select
								id='destinationPassenger'
								onChange={(e) =>
									handleExistingPassengerSelect(
										Number(e.target.value),
										'destination'
									)
								}
								className='w-full px-3 sm:px-4 py-2 sm:py-3 rounded-md sm:rounded-lg bg-white border border-gray-300 text-xs sm:text-sm'
							>
								<option value=''>-- Select Passenger --</option>
								{existingPassengers.map((passenger) => (
									<option
										key={passenger.id}
										value={passenger.id}
									>
										{passenger.name} - {passenger.address}
									</option>
								))}
							</select>
						</div>
					)}

					{/* Booking Details */}
					<div className='col-span-1 sm:col-span-2 gap-2 sm:gap-4 mb-2 sm:mb-4'>
						<label className='block text-xs sm:text-sm font-medium text-gray-700 mb-1'>
							Booking Details
						</label>
						<div className='flex items-center gap-2 sm:gap-4'>
							<input
								type='text'
								value={bookingdetails}
								onChange={(e) => setBookingdetails(e.target.value)}
								placeholder='Booking Details'
								className='w-full px-3 sm:px-4 py-2 sm:py-5 bg-white border rounded-md sm:rounded-lg focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm'
							/>
						</div>
					</div>

					{/* Name, Email, and Phone */}
					<div className='grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mb-2 sm:mb-4'>
						{/* Name Input */}
						<div>
							<label className='block text-xs sm:text-sm font-medium text-gray-700 mb-1'>
								Name <span className='text-red-500'>*</span>
							</label>
							<input
								type='text'
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder='Name'
								className='w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border rounded-md sm:rounded-lg focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm'
							/>
						</div>

						{/* Email Input */}
						<div>
							<label className='block text-xs sm:text-sm font-medium text-gray-700 mb-1'>
								Email
							</label>
							<input
								type='email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder='Email'
								className='w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border rounded-md sm:rounded-lg focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm'
							/>
						</div>

						{/* Phone Input */}
						<div>
							<label className='block text-xs sm:text-sm font-medium text-gray-700 mb-1'>
								Phone
							</label>
							<div className='flex items-center gap-2 sm:gap-4'>
								<input
									type='text'
									value={phone}
									onChange={(e) => setPhone(e.target.value)}
									placeholder='Phone'
									className='w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border rounded-md sm:rounded-lg focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm'
								/>
							</div>
						</div>

						{/* Passengers Dropdown */}
						<div>
							<label className='block text-xs sm:text-sm font-medium text-gray-700 mb-1'>
								Passengers
							</label>
							<select
								value={passengerscount}
								onChange={(e) => setPassengers(e.target.value)}
								className='w-full px-4 py-3 bg-white border rounded-lg focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm'
							>
								{Array.from({ length: 5 }, (_, i) => i + 1).map((num) => (
									<option
										key={num}
										value={num}
									>
										{num} Passenger{num > 1 ? 's' : ''}
									</option>
								))}
							</select>
						</div>
					</div>

					{/* Buttons */}
					<div className='flex flex-col sm:flex-row gap-2 sm:gap-4'>
						{/* Cancel and Create Buttons */}
						<div className='flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto'>
							<button className='w-full sm:w-auto bg-red-500 text-white px-3 sm:px-4 py-2 rounded-md sm:rounded-lg text-xs sm:text-sm hover:bg-red-600 transition duration-300'>
								Cancel
							</button>
							<button
								onClick={handleSubmit}
								className='w-full sm:w-auto bg-red-600 text-white px-3 sm:px-4 py-2 rounded-md sm:rounded-lg text-xs sm:text-sm hover:bg-red-700 transition duration-300'
							>
								Create
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default CreateBookingForm;
