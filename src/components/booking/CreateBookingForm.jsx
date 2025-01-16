/** @format */

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateFormData } from '../../slices/formSlice';
import {
	getAddressSuggestions,
	getAddressDetails,
} from '../../utils/addressAPI'; // Importing functions
import { LuArrowDownUp } from 'react-icons/lu';
import { FiPhoneCall } from 'react-icons/fi';
import Header from '../Common/header';

function CreateBookingForm() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	// Fetch existing data from Redux (if any) to prefill the form
	const formData = useSelector((state) => state.forms.form);

	const [currentDateTime, setCurrentDateTime] = useState('');
	const [returnDateTime, setReturnDateTime] = useState(''); // New state for return time

	useEffect(() => {
		// Function to get the current date and time in the required format
		const getCurrentDateTime = () => {
			const now = new Date();
			const year = now.getFullYear();
			const month = String(now.getMonth() + 1).padStart(2, '0'); // Add leading zero
			const day = String(now.getDate()).padStart(2, '0'); // Add leading zero
			const hours = String(now.getHours()).padStart(2, '0'); // Add leading zero
			const minutes = String(now.getMinutes()).padStart(2, '0'); // Add leading zero

			// Format: YYYY-MM-DDTHH:MM
			return `${year}-${month}-${day}T${hours}:${minutes}`;
		};

		// Set the current date and time
		setCurrentDateTime(getCurrentDateTime());
		setReturnDateTime(getCurrentDateTime());
	}, []);

	// States for pickup and destination details
	const [pickupAddress, setPickupAddress] = useState(
		formData.pickupAddress || ''
	);
	const [pickupPostCode, setPickupPostCode] = useState('');
	const [destinationAddress, setDestinationAddress] = useState(
		formData.destinationAddress || ''
	);
	const [destinationPostCode, setDestinationPostCode] = useState('');
	const [pickupDate, setPickupDate] = useState(
		formData.pickupDateTime
			? formData.pickupDateTime.split(' ')[0]
			: new Date().toISOString().slice(0, 10)
	);
	const [pickupTime, setPickupTime] = useState(
		formData.pickupDateTime
			? formData.pickupDateTime.split(' ')[1]
			: new Date().toLocaleTimeString('en-US', { hour12: false }).slice(0, 5)
	);

	const [passengers, setPassengers] = useState(1);
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');
	

	// States for address suggestions
	const [pickupSuggestions, setPickupSuggestions] = useState([]);
	const [destinationSuggestions, setDestinationSuggestions] = useState([]);

	const [isReturn, setIsReturn] = useState(false);

	const handleReturnToggle = () => {
		setIsReturn(!isReturn);
	};

	// Fetch address suggestions as the user types
	const fetchSuggestions = async (value, isPickup = true) => {
		if (value.length > 2) {
			const suggestions = await getAddressSuggestions(value);
			if (isPickup) {
				setPickupSuggestions(suggestions);
			} else {
				setDestinationSuggestions(suggestions);
			}
		} else {
			if (isPickup) setPickupSuggestions([]);
			else setDestinationSuggestions([]);
		}
	};

	// Handle address selection from suggestions
	const handleSelectAddress = async (id, isPickup = true) => {
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
	};

	// Switch pickup and destination details
	const handleSwitch = () => {
		setPickupAddress(destinationAddress);
		setDestinationAddress(pickupAddress);
		setPickupPostCode(destinationPostCode);
		setDestinationPostCode(pickupPostCode);
	};

	// Handle form submission
	const handleSubmit = () => {
		if (!pickupAddress || !pickupDate || !pickupTime) {
			alert('Please fill in all required fields.');
			return;
		}

		const bookingDetails = {
			pickupAddress,
			pickupPostCode,
			destinationAddress,
			destinationPostCode,
			pickupDateTime: `${pickupDate} ${pickupTime}`,
			passengers,
			name,
			email,
			phone,
		};

		// Dispatch the form data to Redux
		dispatch(updateFormData(bookingDetails));

		// Navigate to the next step
		navigate('/select-vehicle');
	};

	const backhistory = () => {
		navigate('/dashboard');
	};

	return (
		<div>
			<Header />

			<div className='flex justify-center bg-[#F3F4F6] px-4 sm:py-10 sm:px-4'>
				<div className='bg-white bg-opacity-90 p-4 sm:p-8 rounded-xl shadow-lg w-full max-w-4xl overflow-y-auto h-[75vh] '>
					<button
						onClick={backhistory}
						className='bg-gradient-to-r from-blue-500 to-blue-400 text-white py-1 px-3 m-4 rounded-lg hover:from-blue-600 hover:to-blue-500 transition-all duration-300 shadow-md'
					>
						Back
					</button>

					{/* Date and ASAP */}
					<div className='flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 mb-4 sm:mb-6'>
						<div className='flex flex-col sm:flex-row items-center gap-2 sm:gap-4'>
							<input
								type='datetime-local'
								value={currentDateTime}
								onChange={(e) => setCurrentDateTime(e.target.value)}
								className='w-full sm:w-auto p-2 bg-white border rounded-md sm:rounded-lg text-sm focus:ring-2 focus:ring-blue-500'
							/>
							{isReturn && (
								<input
									type='datetime-local'
									value={returnDateTime}
									onChange={(e) => setReturnDateTime(e.target.value)}
									className='w-full sm:w-auto p-2 bg-white border rounded-md sm:rounded-lg text-sm focus:ring-2 focus:ring-blue-500'
								/>
							)}
						</div>
						<div className='flex items-center gap-2 sm:gap-4 w-full sm:w-auto'>
							<button className='w-full sm:w-auto bg-blue-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm'>
								Repeat Booking
							</button>
							<label className='flex items-center gap-1 sm:gap-2 text-gray-700 cursor-pointer text-xs sm:text-sm'>
								<div
									className={`relative w-8 h-5 sm:w-10 sm:h-6 rounded-full ${
										isReturn ? 'bg-blue-500' : 'bg-gray-300'
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

					{/* Pickup Address and Post Code */}
					<div className='grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mb-2 sm:mb-4'>
						{/* Pickup Address */}
						<div>
							<label className='block text-xs sm:text-sm font-medium text-gray-700 mb-1'>
								Pickup Address <span className='text-blue-500'>*</span>
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
												onClick={() => handleSelectAddress(suggestion.id, true)}
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

					<div className='text-center'>
						<button
							onClick={handleSwitch}
							className='p-2 text-sky-600'
						>
							<LuArrowDownUp />
						</button>
					</div>

					{/* Destination Address */}
					<div className='grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mb-2 sm:mb-4'>
						{/* Destination Address */}
						<div>
							<label className='block text-xs sm:text-sm font-medium text-gray-700 mb-1'>
								Destination Address <span className='text-blue-500'>*</span>
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

					{/* Booking Details */}
					<div className='col-span-1 sm:col-span-2 gap-2 sm:gap-4 mb-2 sm:mb-4'>
						<label className='block text-xs sm:text-sm font-medium text-gray-700 mb-1'>
							Booking Details
						</label>
						<div className='flex items-center gap-2 sm:gap-4'>
							<input
								type='text'
								value={phone}
								onChange={(e) => setPhone(e.target.value)}
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
								Name <span className='text-blue-500'>*</span>
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
								<button className='px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-md sm:rounded-lg hover:bg-blue-700 transition duration-300 text-xs sm:text-sm'>
									<FiPhoneCall />
								</button>
							</div>
						</div>

						{/* Passengers Dropdown */}
						<div>
							<label className='block text-xs sm:text-sm font-medium text-gray-700 mb-1'>
								Passengers
							</label>
							<select
								value={passengers}
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
					<div className=' flex flex-col sm:flex-row gap-2 sm:gap-4'>
						{/* Cancel and Create Buttons */}
						<div className='flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto'>
							<button className='w-full sm:w-auto bg-black text-white px-3 sm:px-4 py-2 rounded-md sm:rounded-lg text-xs sm:text-sm hover:bg-gray-800 transition duration-300'>
								Cancel
							</button>
							<button
								onClick={handleSubmit}
								className='w-full sm:w-auto bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-md sm:rounded-lg text-xs sm:text-sm hover:bg-blue-700 transition duration-300'
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
