/** @format */

import { useNavigate } from 'react-router-dom';
import Header from '../Common/header';

function Confirmation() {
	// Static data for booking details, vehicle, and user
	const bookingDetails = {
		date: '2024-10-21',
		time: '10:30 AM',
		from: 'Gillingham Station',
		to: 'London Bridge Station',
	};
	const selectedVehicle = {
		name: 'Tesla Model 3',
		price: '£65.00',
	};
	const userDetails = {
		firstName: 'John',
		lastName: 'Doe',
		phone: '+44 123 456 7890',
		email: 'john.doe@example.com',
		flightNumber: 'BA123',
		pickupSign: 'John D.',
		notes: 'Please call upon arrival.',
		paymentMethod: 'Credit Card',
	};

	const navigate = useNavigate();

	// Placeholder for reservation number and other fixed data
	const reservationNumber = 'SKT-000052';
	const bookingDate = '2024-10-21 09:52';

	const handleFinish = () => {
		// Prepare the complete booking information
		const newBooking = {
			reservationNumber,
			date: bookingDetails.date,
			time: bookingDetails.time,
			from: bookingDetails.from,
			to: bookingDetails.to,
			vehicleName: selectedVehicle.name,
			price: selectedVehicle.price,
			paymentMethod: userDetails.paymentMethod,
			firstName: userDetails.firstName,
			lastName: userDetails.lastName,
			phone: userDetails.phone,
			email: userDetails.email,
			flightNumber: userDetails.flightNumber,
			pickupSign: userDetails.pickupSign,
			notes: userDetails.notes,
			bookingDate,
		};

		// Retrieve existing history or create a new array
		const storedHistory =
			JSON.parse(localStorage.getItem('bookingHistory')) || [];
		storedHistory.push(newBooking);
		localStorage.setItem('bookingHistory', JSON.stringify(storedHistory));

		// Navigate back to the home page or any starting point
		navigate('/bookinghistory');
	};

	return (
		<div>
			<Header />

		<div className='flex items-center justify-center min-h-screen bg-gradient-to-br p-4'>
			<div
				className='bg-white bg-opacity-95 p-6 sm:p-8 rounded-xl shadow-xl w-full max-w-4xl space-y-6 overflow-y-auto'
				style={{ maxHeight: '90vh' }} // Constrain the height to ensure scroll
			>
				<h2 className='text-base sm:text-lg md:text-2xl font-semibold text-sky-800 mb-4 sm:mb-6 text-center'>
					Booking Confirmation:{' '}
					<span className='text-red-500 text-sm sm:text-base md:text-lg'>
						Thank you for booking with Ace Taxi. Your reservation number is{' '}
						{reservationNumber}.
					</span>
				</h2>

				{/* Trip Details */}
				<div className='flex flex-col md:flex-row gap-4 sm:gap-6'>
					<div className='flex-1 p-3 sm:p-4 border border-gray-200 rounded-lg bg-gray-50'>
						<h3 className='text-sm sm:text-lg font-medium text-red-500 mb-2'>
							Trip Details
						</h3>
						<p className='text-xs sm:text-sm text-gray-700'>
							<span className='font-normal'>Date & Time:</span>{' '}
							{bookingDetails.date} {bookingDetails.time}
						</p>
						<p className='text-xs sm:text-sm text-gray-700'>
							<span className='font-normal'>From:</span> {bookingDetails.from}
						</p>
						<p className='text-xs sm:text-sm text-gray-700'>
							<span className='font-normal'>To:</span> {bookingDetails.to}
						</p>
						<p className='text-xs sm:text-sm text-gray-700'>
							<span className='font-normal'>Estimated Time:</span> 1 hr 19 min
						</p>
						<p className='text-xs sm:text-sm text-gray-700'>
							<span className='font-normal'>Distance:</span> 40.48 miles
						</p>
						<h4 className='mt-4 text-xs sm:text-sm font-medium text-gray-800'>
							Additional Details
						</h4>
						<p className='text-xs sm:text-sm text-gray-700'>
							<span className='font-normal'>Flight Number:</span>{' '}
							{userDetails.flightNumber}
						</p>
						<p className='text-xs sm:text-sm text-gray-700'>
							<span className='font-normal'>Pickup Sign:</span>{' '}
							{userDetails.pickupSign}
						</p>
						<p className='text-xs sm:text-sm text-gray-700'>
							<span className='font-normal'>Notes for Chauffeur:</span>{' '}
							{userDetails.notes}
						</p>
					</div>

					{/* Vehicle & Customer Details */}
					<div className='flex-1 p-3 sm:p-4 border border-gray-200 rounded-lg bg-gray-50'>
						<h3 className='text-sm sm:text-lg font-medium text-red-500 mb-2'>
							Vehicle Details
						</h3>
						<p className='text-xs sm:text-sm text-gray-700'>
							<span className='font-normal'>Vehicle Name:</span>{' '}
							{selectedVehicle.name}
						</p>
						<p className='text-xs sm:text-sm text-gray-700'>
							<span className='font-normal'>Price:</span>{' '}
							{selectedVehicle.price}
						</p>
						<h3 className='text-sm sm:text-lg font-medium text-red-500 mt-4 mb-2'>
							Customer Information
						</h3>
						<p className='text-xs sm:text-sm text-gray-700'>
							<span className='font-normal'>Name:</span> {userDetails.firstName}{' '}
							{userDetails.lastName}
						</p>
						<p className='text-xs sm:text-sm text-gray-700'>
							<span className='font-normal'>Phone Number:</span>{' '}
							{userDetails.phone}
						</p>
						<p className='text-xs sm:text-sm text-gray-700'>
							<span className='font-normal'>Email:</span> {userDetails.email}
						</p>
						<h3 className='text-sm sm:text-lg font-medium text-red-500 mt-4 mb-2'>
							Booking Details
						</h3>
						<p className='text-xs sm:text-sm text-gray-700'>
							<span className='font-normal'>Reservation Number:</span>{' '}
							{reservationNumber}
						</p>
						<p className='text-xs sm:text-sm text-gray-700'>
							<span className='font-normal'>Booking Date:</span> {bookingDate}
						</p>
						<p className='text-xs sm:text-sm text-gray-700'>
							<span className='font-normal'>Payment Method:</span>{' '}
							{userDetails.paymentMethod}
						</p>
					</div>
				</div>

				{/* Action Buttons */}
				<div className='flex flex-col sm:flex-row gap-4 sm:gap-6 mt-4 sm:mt-8'>
					<button
						onClick={() => window.print()}
						className='flex-1 bg-gradient-to-r from-sky-600 to-blue-500 text-white py-2 sm:py-3 rounded-md sm:rounded-lg text-xs sm:text-sm hover:from-sky-700 hover:to-blue-700 transition-all duration-300 shadow-md'
					>
						Print
					</button>
					<button
						onClick={handleFinish}
						className='flex-1 bg-gradient-to-r from-green-500 to-green-400 text-white py-2 sm:py-3 rounded-md sm:rounded-lg text-xs sm:text-sm hover:from-green-600 hover:to-green-500 transition-all duration-300 shadow-md'
					>
						Finish
					</button>
				</div>
			</div>
		</div>
		</div>
	);
}

export default Confirmation;
