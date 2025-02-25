/** @format */

// Importing necessary hooks and libraries
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
	getAddressSuggestions,
	getCombinedSuggestions,
	getAddressDetails,
} from '../../utils/addressAPI'; // Utility functions for address handling
import { LuArrowDownUp } from 'react-icons/lu'; // Importing switch icon
import Header from '../Common/header'; // Header component
import { TiArrowBack } from 'react-icons/ti';
import { fetchPassengers } from '../../slices/formSlice';
import { createActionPlanThunk } from '../../slices/webbookingSlice'; // Redux action
import RepeatBooking from './RepeatBooking'; // Import the modal component

// Main functional component for creating a booking form
function CreateBookingForm() {
	const dispatch = useDispatch(); // Redux dispatch function
	const navigate = useNavigate(); // React Router function for navigation
	// Use the passengers array from Redux store dynamically
	const { passengers = [] } = useSelector((state) => state.forms);
	const { token = '', username, userId } = useSelector((state) => state.auth);
	const formData = useState();

	const location = useLocation(); // ✅ Fetch passed data from state
	const bookingData = location.state; // ✅ Default to empty object if no data

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
	// const [currentDateTime, setCurrentDateTime] = useState(''); // Current datetime state
	// const [returnDateTime, setReturnDateTime] = useState(''); // Return datetime state

	// Separate states for pickup and return date/time
	const [pickupDate, setPickupDate] = useState(''); // Pickup date
	const [pickupTime, setPickupTime] = useState(''); // Pickup time
	const [returnDate, setReturnDate] = useState(''); // Return date
	const [returnTime, setReturnTime] = useState(''); // Return time

	// useEffect to initialize current and return date/time
	useEffect(() => {
		const now = new Date();

		// Set the initial values for pickup and return date/time
		setPickupDate(now.toISOString().split('T')[0]);
		setPickupTime(now.toTimeString().split(':').slice(0, 2).join(':'));

		setReturnDate(now.toISOString().split('T')[0]);
		setReturnTime(now.toTimeString().split(':').slice(0, 2).join(':'));
	}, []);

	// State for the recurrence rule string
	const [recurrenceRule, setRecurrenceRule] = useState('');
	console.log(recurrenceRule + 'craete booking');
	const [isRepeatModalOpen, setIsRepeatModalOpen] = useState(false); // Modal state
	// Handle modal open/close
	const openRepeatModal = () => setIsRepeatModalOpen(true);
	const closeRepeatModal = () => setIsRepeatModalOpen(false);
	// Handle confirm in the modal
	const handleRepeatConfirm = (data) => {
		const generatedRule = data.recurrenceRule;
		setRecurrenceRule(generatedRule);
		console.log('Repeat Booking Data:', data); // Handle repeat booking logic
		closeRepeatModal(); // Close the modal after confirming
	};

	// States for pickup and destination details
	const [pickupAddress, setPickupAddress] = useState(
		formData?.pickupAddress || '' // Use optional chaining and a default value
	);
	const [pickupPostCode, setPickupPostCode] = useState(''); // Pickup postcode state
	const [destinationAddress, setDestinationAddress] = useState(
		formData?.destinationAddress || '' // Prefill from Redux or set as empty
	);
	const [destinationPostCode, setDestinationPostCode] = useState(''); // Destination postcode state
	// States for other form details
	const [passengerscount, setPassengers] = useState(1); // Number of passengers state
	const [passengerName, setName] = useState(''); // Name state
	const [email, setEmail] = useState(''); // Email state
	const [phoneNumber, setPhone] = useState(''); // Phone number state
	const [details, setBookingdetails] = useState(''); // bookingdetails

	// States for address suggestions
	const [pickupSuggestions, setPickupSuggestions] = useState([]); // Suggestions for pickup address
	const [destinationSuggestions, setDestinationSuggestions] = useState([]); // Suggestions for destination address

	// State for return trip toggle
	const [isReturn, setIsReturn] = useState(false); // Whether return trip is enabled

	const [viewMode, setViewMode] = useState('address'); // "address" or "existing"
	const [destiMode, setDestiMode] = useState('address');

	const [highlightIndexPickup, setHighlightIndexPickup] = useState(-1); // Pickup dropdown highlight
	const [highlightIndexDest, setHighlightIndexDest] = useState(-1); // Destination dropdown highlight

	const [arriveBy, setArriveBy] = useState(false); // ✅ Default false


	// ✅ Prefill form fields when page loads
	useEffect(() => {
		if (bookingData) {
			setPickupAddress(bookingData.pickupAddress || '');
			setPickupPostCode(bookingData.pickupPostCode || '');
			setDestinationAddress(bookingData.destinationAddress || '');
			setDestinationPostCode(bookingData.destinationPostCode || '');
			setName(bookingData.passengerName || '');
			setPassengers(bookingData.passengers || 1);
			setPhone(bookingData.phoneNumber || '');
			setEmail(bookingData.email || '');
		}
	}, [bookingData]);

	useEffect(() => {
		if (pickupDate) {
			setReturnDate(pickupDate); // ✅ Auto-set Return Date same as Pickup
		}
	}, [pickupDate]);

	// Function to handle selecting an existing passenger
	const handleExistingPassengerSelect = (passengerId, mode) => {
		const selectedPassenger = existingPassengers.find(
			(passenger) => passenger.id === passengerId
		);
		console.log(existingPassengers + 'existingPassengers');

		if (selectedPassenger) {
			if (mode === 'pickup') {
				// Fill pickup address and postcode
				setPickupAddress(selectedPassenger.address);
				setPickupPostCode(selectedPassenger.postcode);
				setName(selectedPassenger.name);
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
			// ✅ Step 1: Check for matches in existing passengers
			const passengerMatches = existingPassengers
				.filter(
					(passenger) =>
						passenger.address.toLowerCase().includes(value.toLowerCase()) ||
						passenger.name.toLowerCase().includes(value.toLowerCase())
				)
				.map((passenger) => ({
					id: `passenger-${passenger.id}`, // Unique ID for UI
					label: `${passenger.name} - ${passenger.address}`,
					address: passenger.address,
					postcode: passenger.postcode,
					type: 'passenger', // ✅ Mark as an existing passenger
				}));

			// ✅ Step 2: Fetch external address suggestions from API
			const apiSuggestions = await getAddressSuggestions(value);

			// ✅ Step 3: Combine results with existing passengers **first**
			const combinedSuggestions = [...passengerMatches, ...apiSuggestions];

			// ✅ Step 4: Update state for either Pickup or Destination
			if (isPickup) {
				setPickupSuggestions(combinedSuggestions);
				setHighlightIndexPickup(-1); // Reset highlight
			} else {
				setDestinationSuggestions(combinedSuggestions);
				setHighlightIndexDest(-1); // Reset highlight
			}
		} else {
			// Clear suggestions if input is too short
			if (isPickup) setPickupSuggestions([]);
			else setDestinationSuggestions([]);
		}
	};

	const handleKeyDownPickup = (e) => {
		if (pickupSuggestions.length === 0) return;

		if (e.key === 'ArrowDown') {
			setHighlightIndexPickup((prev) => {
				const nextIndex = prev < pickupSuggestions.length - 1 ? prev + 1 : prev;
				scrollToHighlightedItem(nextIndex, 'pickup-dropdown');
				return nextIndex;
			});
		} else if (e.key === 'ArrowUp') {
			setHighlightIndexPickup((prev) => {
				const prevIndex = prev > 0 ? prev - 1 : 0;
				scrollToHighlightedItem(prevIndex, 'pickup-dropdown');
				return prevIndex;
			});
		} else if (e.key === 'Enter' && highlightIndexPickup !== -1) {
			handleSelectAddress(pickupSuggestions[highlightIndexPickup].id, true);
		} else if (e.key === 'Escape') {
			setHighlightIndexPickup(-1);
			setPickupSuggestions([]);
		}
	};

	const handleKeyDownDest = (e) => {
		if (destinationSuggestions.length === 0) return;

		if (e.key === 'ArrowDown') {
			// ✅ Move Down
			setHighlightIndexDest((prev) => {
				const nextIndex =
					prev < destinationSuggestions.length - 1 ? prev + 1 : prev;
				scrollToHighlightedItem(nextIndex, 'destination-dropdown');
				return nextIndex;
			});
		} else if (e.key === 'ArrowUp') {
			// ✅ Move Up
			setHighlightIndexDest((prev) => {
				const prevIndex = prev > 0 ? prev - 1 : 0;
				scrollToHighlightedItem(prevIndex, 'destination-dropdown');
				return prevIndex;
			});
		} else if (e.key === 'Enter' && highlightIndexDest !== -1) {
			// ✅ Select Highlighted Item
			handleSelectAddress(destinationSuggestions[highlightIndexDest].id, false);
		} else if (e.key === 'Escape') {
			// ✅ Close Dropdown
			setHighlightIndexDest(-1);
			setDestinationSuggestions([]);
		}
	};

	const scrollToHighlightedItem = (index, dropdownId) => {
		const dropdown = document.getElementById(dropdownId);
		const highlightedItem = document.getElementById(`${dropdownId}-${index}`);

		if (dropdown && highlightedItem) {
			dropdown.scrollTop = highlightedItem.offsetTop - dropdown.offsetTop;
		}
	};

	// Handle address selection from suggestions
	const handleSelectAddress = async (id, isPickup = true) => {
		if (id.startsWith('passenger-')) {
			// ✅ If selected from existing passengers, fill the form directly
			const passengerId = id.split('-')[1];
			const selectedPassenger = existingPassengers.find(
				(p) => p.id === Number(passengerId)
			);

			if (selectedPassenger) {
				if (isPickup) {
					setPickupAddress(selectedPassenger.address);
					setPickupPostCode(selectedPassenger.postcode);
					setName(selectedPassenger.name); // ✅ Auto-fill name
					setPickupSuggestions([]);
				} else {
					setDestinationAddress(selectedPassenger.address);
					setDestinationPostCode(selectedPassenger.postcode);
					setDestinationSuggestions([]);
				}
			}
		} else {
			// ✅ Otherwise, fetch address details from the API
			const details = await getAddressDetails(id);
			if (isPickup) {
				setPickupAddress(details.address);
				setPickupPostCode(details.postcode);
				setPickupSuggestions([]);
			} else {
				setDestinationAddress(details.address);
				setDestinationPostCode(details.postcode);
				setDestinationSuggestions([]);
			}
		}
	};

	// Switch pickup and destination details
	const handleSwitch = () => {
		setPickupAddress(destinationAddress); // Switch addresses
		setDestinationAddress(pickupAddress);
		setPickupPostCode(destinationPostCode); // Switch postcodes
		setDestinationPostCode(pickupPostCode);
	};

	// Combine date and time into ISO format (without milliseconds)
	const pickupDateTime = `${pickupDate}T${pickupTime}:00`; // Example: 2025-01-22T03:34:20
	const returnDateTime = isReturn ? `${returnDate}T${returnTime}:00` : null;

	// Handle form submission
	const handleSubmit = async () => {
		// Validate required fields
		if (
			!pickupAddress ||
			!pickupPostCode ||
			!destinationAddress ||
			!passengerName
		) {
			alert('Please fill in all required fields.');
			return;
		}

		if (!pickupDate || !returnDate) {
			alert('Please select both Pickup and Return Dates.');
			return;
		}

		if (new Date(returnDate) < new Date(pickupDate)) {
			alert('Return Date cannot be before Pickup Date!');
			return;
		}

		// Prepare the common form data
		const formData = {
			accNo: username, // Static account number
			pickupDateTime, // Dynamic field
			recurrenceRule: recurrenceRule, // Static or fallback value
			pickupAddress: pickupAddress.trim(), // Trim whitespace
			pickupPostCode: pickupPostCode.trim(), // Trim whitespace
			destinationAddress: destinationAddress.trim(), // Trim whitespace
			destinationPostCode: destinationPostCode.trim(), // Trim whitespace
			details: details || '', // Optional field with fallback
			passengerName: passengerName.trim(), // Map passengerName to passenger
			phoneNumber: phoneNumber?.trim() || '', // Optional field with fallback
			email: email?.trim() || '', // Optional field with fallback
			passengers: passengerscount,
			arriveBy: arriveBy, // ✅ True/False based on toggle
		};

		try {
			// First API call: Submit the original data
			await dispatch(createActionPlanThunk({ formData })).unwrap();

			// If it's a return trip, prepare and send the second API call
			if (isReturn) {
				const returnFormData = {
					...formData,
					pickupDateTime: returnDateTime, // Use the return date and time for the second trip
					pickupAddress: destinationAddress.trim(), // Swap pickup and destination
					pickupPostCode: destinationPostCode.trim(),
					destinationAddress: pickupAddress.trim(),
					destinationPostCode: pickupPostCode.trim(),
					// recurrenceRule: null, // Clear the recurrence rule for the return trip
				};

				// Second API call for the return trip
				await dispatch(
					createActionPlanThunk({ formData: returnFormData })
				).unwrap();
			}

			// Navigate to the confirmation page after successful submissions
			navigate('/confirmation');
		} catch (error) {
			console.error('Error submitting form:', error);
			alert('An error occurred while creating the booking.');
		}
	};

	// Navigate back to the dashboard
	const backhistory = () => {
		navigate('/');
	};

	return (
		<div className='bg-white min-h-screen overflow-y-auto h-[90vh]'>
			<Header />
			<div className='flex justify-center px-4 py-4 sm:py-1 sm:px-1 bg-white'>
				<div className='bg-white bg-opacity-90 p-4 shadow-xl sm:p-2 sm:px-8 rounded-xl w-full max-w-4xl sm:min-h-[825px] min-h-[1100px]  max-h-[40vh] overflow-y-auto'>
					<button
						onClick={backhistory}
						className='bg-[#b91c1c] text-white py-1 px-2 sm:py-1 sm:px-5 mb-4 rounded-md sm:rounded-lg hover:from-[#b91c1c] hover:to-red-500 transition-all duration-300 shadow-md flex items-center text-sm sm:text-base'
					>
						<TiArrowBack className='mr-1 sm:mr-2 text-s sm:text-xl' />
						<span>Back</span>
					</button>

					<div className='flex  gap-2 mb-4'>
						<span
							className={`text-sm font-medium ${
								arriveBy ? 'text-gray-500' : 'text-red-600'
							}`}
						>
							Pickup Time
						</span>
						<div
							className={`relative w-10 h-5 rounded-full cursor-pointer transition-all duration-300 ${
								arriveBy ? 'bg-red-600' : 'bg-gray-400'
							}`}
							onClick={() => setArriveBy(!arriveBy)} // ✅ Toggle True/False
						>
							<div
								className={`absolute w-4 h-4 bg-white rounded-full top-[2px] transition-transform duration-300 ${
									arriveBy ? 'translate-x-5' : 'translate-x-1'
								}`}
							></div>
						</div>
						<span
							className={`text-sm font-medium ${
								arriveBy ? 'text-red-600' : 'text-gray-500'
							}`}
						>
							Arrived By
						</span>
					</div>

					{/* Date and ASAP */}
					<div className='flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6 mb-6'>
						{/* Date and Time Inputs */}
						<div className='flex sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-1/2'>
							{/* Date Input */}
							<div className='flex flex-col w-1/2'>
								<label className='block text-xs sm:text-sm font-medium text-gray-700 '>
									Date <span className='text-red-500'>*</span>
								</label>
								<input
									type='date'
									value={pickupDate} // Bind to pickupDate state
									onChange={(e) => setPickupDate(e.target.value)} // Update date state
									className='w-full p-2 sm:p-3 bg-white border border-gray-300 rounded-md sm:rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-black'
								/>
							</div>

							{/* Time Input */}
							<div className='flex flex-col w-1/2'>
								<label className='block text-xs sm:text-sm font-medium text-gray-700'>
									Time <span className='text-red-500'>*</span>
								</label>
								<input
									type='time'
									value={pickupTime} // Bind to pickupTime state
									onChange={(e) => setPickupTime(e.target.value)} // Update time state
									className='w-full p-2 sm:p-3 bg-white border border-gray-300 rounded-md sm:rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-black'
								/>
							</div>
						</div>

						{isReturn && (
							<div className='flex flex-row items-center gap-2 sm:gap-4 w-full'>
								{/* Return Date Input */}
								<div className='flex flex-col w-1/2'>
									<label className='block text-xs sm:text-sm font-medium text-gray-700'>
										Return Date <span className='text-red-500'>*</span>
									</label>
									<input
										type='date'
										value={returnDate}
										onChange={(e) => setReturnDate(e.target.value)}
										min={pickupDate} // ✅ Disable past return dates
										className='w-full p-2 sm:p-3 bg-white border border-gray-300 rounded-md sm:rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-black'
									/>
								</div>

								{/* Return Time Input */}
								<div className='flex flex-col w-1/2'>
									<label className='block text-xs sm:text-sm font-medium text-gray-700'>
										Return Time <span className='text-red-500'>*</span>
									</label>
									<input
										type='time'
										value={returnTime} // Bind to returnTime state
										onChange={(e) => setReturnTime(e.target.value)} // Update time state
										className='w-full p-2 sm:p-3 bg-white border border-gray-300 rounded-md sm:rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-black'
									/>
								</div>
							</div>
						)}

						{/* Buttons and Toggle */}
						<div className='flex flex-row sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto'>
							<button
								onClick={openRepeatModal}
								className='w-50 sm:w-auto bg-[#b91c1c] text-white px-2 sm:px-4 py-1 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm hover:from-[#b91c1c] hover:to-red-500 transition-all duration-300'
							>
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
										className={`absolute w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full shadow-md top-[1px] sm:top-[2px] left-[1px] transform transition-transform duration-300 ${
											isReturn
												? 'translate-x-4 sm:translate-x-5'
												: 'translate-x-0'
										}`}
									></div>
								</div>
								<span>Return</span>
							</label>
						</div>
					</div>

					{/* Buttons for Address and Existing Passenger */}
					<div className='flex gap-2 sm:gap-4 mb-4'>
						<button
							onClick={() => setViewMode('address')}
							className={`px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm ${
								viewMode === 'address'
									? 'bg-[#b91c1c] text-white'
									: 'bg-gray-200 text-gray-700'
							} hover:bg-[#b91c1c] hover:text-white transition-all duration-300`}
						>
							Address
						</button>
						<button
							onClick={() => setViewMode('existing')}
							className={`px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm ${
								viewMode === 'existing'
									? 'bg-[#b91c1c] text-white'
									: 'bg-gray-200 text-gray-700'
							} hover:bg-[#b91c1c] hover:text-white transition-all duration-300`}
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
										onKeyDown={handleKeyDownPickup} // ✅ Keyboard navigation
										className='w-full px-3 sm:px-4 py-2 sm:py-3 rounded-md sm:rounded-lg bg-white border border-gray-300 text-xs sm:text-sm'
									/>

									{/* Suggestions Dropdown */}
									{pickupSuggestions.length > 0 && (
										<ul
											id='pickup-dropdown'
											className='absolute z-10 bg-white border border-gray-300 rounded shadow-lg max-h-40 overflow-y-auto w-full mt-1'
										>
											{pickupSuggestions.map((suggestion, index) => (
												<li
													id={`pickup-dropdown-${index}`}
													key={suggestion.id}
													onClick={() =>
														handleSelectAddress(suggestion.id, true)
													}
													className={`px-3 py-2 cursor-pointer text-[0.85rem] ${
														suggestion.type === 'passenger'
															? 'font-bold'
															: 'hover:bg-gray-100'
													} ${
														highlightIndexPickup === index ? 'bg-gray-300' : ''
													}`}
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
									Post Code <span className='text-red-500'>*</span>
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
					<div className='flex gap-2 sm:gap-4 mb-4'>
						<button
							onClick={() => setDestiMode('address')}
							className={`px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm ${
								destiMode === 'address'
									? 'bg-[#b91c1c] text-white'
									: 'bg-gray-200 text-gray-700'
							} hover:bg-[#b91c1c] hover:text-white transition-all duration-300`}
						>
							Address
						</button>
						<button
							onClick={() => setDestiMode('existing')}
							className={`px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm ${
								destiMode === 'existing'
									? 'bg-[#b91c1c] text-white'
									: 'bg-gray-200 text-gray-700'
							} hover:bg-[#b91c1c] hover:text-white transition-all duration-300`}
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
									Destination Address <span className='text-[#b91c1c]'>*</span>
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
										onKeyDown={handleKeyDownDest} // ✅ Keyboard navigation
										className='w-full px-3 sm:px-4 py-2 sm:py-3 rounded-md sm:rounded-lg bg-white border border-gray-300 text-xs sm:text-sm'
									/>

									{/* Suggestions Dropdown */}
									{destinationSuggestions.length > 0 && (
										<ul
											id='destination-dropdown'
											className='absolute z-10 bg-white border border-gray-300 rounded shadow-lg max-h-40 overflow-y-auto w-full mt-1'
										>
											{destinationSuggestions.map((suggestion, index) => (
												<li
													id={`destination-dropdown-${index}`}
													key={suggestion.id}
													onClick={() =>
														handleSelectAddress(suggestion.id, false)
													}
													className={`px-3 py-2 cursor-pointer text-[0.85rem] ${
														suggestion.type === 'passenger'
															? 'font-bold'
															: 'hover:bg-gray-100'
													} ${
														highlightIndexDest === index ? 'bg-gray-300' : ''
													}`}
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
									Post Code <span className='text-red-500'>*</span>
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
								value={details}
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
								value={passengerName}
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
									value={phoneNumber}
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
						<div className='flex flex-col sm:flex-row gap-2 sm:gap-4 w-full justify-end'>
							<button className='w-full sm:w-auto bg-[#f3f4f6] text-black px-3 sm:px-4 py-2 rounded-md sm:rounded-lg text-xs sm:text-sm transition duration-300'>
								Cancel
							</button>
							<button
								onClick={handleSubmit}
								className='w-full sm:w-auto bg-black text-white px-3 sm:px-4 py-2 rounded-md sm:rounded-lg text-xs sm:text-sm transition duration-300'
							>
								Create
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Repeat Booking Modal */}
			<RepeatBooking
				isOpen={isRepeatModalOpen}
				onClose={closeRepeatModal}
				onConfirm={handleRepeatConfirm}
			/>
		</div>
	);
}

export default CreateBookingForm;
