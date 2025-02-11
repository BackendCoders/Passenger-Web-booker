/** @format */
import { useNavigate } from 'react-router-dom';
import Header from '../Common/header';
import addpassenger from '../../assets/addpassenger.svg';
import existingpassenger from '../../assets/existingpassenger.svg';
import newbooking from '../../assets/newbooking.svg';
import payment from '../../assets/transaction-history.svg';
import customImage from '../../assets/acelogo2.png'; // Import your uploaded image

const BookingDashboard = () => {
	const navigate = useNavigate();

	const handleCreateBooking = () => {
		navigate('/createbookingform');
	};

	const handleBookingHistory = () => { 
		navigate('/bookinghistory');
	};

	const handleAddPassenger = () => {
		navigate('/AddPassenger');
	};

	const handleExistingPassengers = () => {
		navigate('/existingPassengers');
	};

	return (
		<div className='flex flex-col min-h-screen bg-white'>
			{/* Header Section */}
			<Header />

			{/* Custom Image Section */}
			{/* <div className='relative flex justify-center items-center mt-8'>
				<img
					src={customImage}
					alt='Custom Banner'
					className='w-[550px] h-[200px] object-contain hidden sm:block' // Adjust width and height here
				/>
			</div>
			<div className='flex justify-center items-center px-4 rounded'>
				<h2 className='text-lg sm:text-2xl font-bold text-center'>
					ACCOUNT BOOKING REQUEST FORM
				</h2>
			</div> */}

			{/* Main Section */}
			<div className='flex-1 flex justify-center items-center overflow-y-auto p-4'>
				{/* Buttons Section */}
				<div className='grid grid-cols-1 sm:grid-cols-4 gap-6 w-full max-w-6xl'>
					{/* Create New Booking Button */}
					<button
						onClick={handleCreateBooking}
						className='group bg-[#b91c1c] text-white rounded-lg shadow-lg py-6 sm:py-8 px-3 sm:px-6 text-center hover:bg-red-700 transition duration-300 flex flex-col items-center'
					>
						<img
							src={newbooking}
							alt='New Booking'
							className='w-12 h-12 sm:w-20 sm:h-20 mb-3 sm:mb-4 group-hover:scale-110 group-hover:filter transition-transform duration-300'
						/>
						<span className='font-semibold text-xs sm:text-lg text-center'>
							CREATE NEW BOOKING
						</span>
					</button>

					{/* History Page */}
					<button
						onClick={handleBookingHistory}
						className='group bg-[#b91c1c] text-white rounded-lg shadow-lg py-6 sm:py-8 px-3 sm:px-6 text-center hover:bg-red-700 transition duration-300 flex flex-col items-center'
					>
						<img
							src={payment}
							alt='Booking History'
							className='w-12 h-12 sm:w-20 sm:h-20 mb-3 sm:mb-4 group-hover:scale-110 group-hover:filter transition-transform duration-300'
						/>
						<span className='font-semibold text-xs sm:text-lg text-center'>
							BOOKING HISTORY
						</span>
					</button>

					{/* Add New Passenger Button */}
					<button
						onClick={handleAddPassenger}
						className='group bg-[#b91c1c] text-white rounded-lg shadow-lg py-6 sm:py-8 px-3 sm:px-6 text-center hover:bg-red-700 transition duration-300 flex flex-col items-center'
					>
						<img
							src={addpassenger}
							alt='Add Passenger'
							className='w-12 h-12 sm:w-20 sm:h-20 mb-3 sm:mb-4 group-hover:scale-110 group-hover:filter transition-transform duration-300'
						/>
						<span className='font-semibold text-xs sm:text-lg text-center'>
							ADD NEW PASSENGER
						</span>
					</button>

					{/* Existing Passengers Button */}
					<button
						onClick={handleExistingPassengers}
						className='group bg-[#b91c1c] text-white rounded-lg shadow-lg py-6 sm:py-8 px-3 sm:px-6 text-center hover:bg-red-700 transition duration-300 flex flex-col items-center'
					>
						<img
							src={existingpassenger}
							alt='Existing Passengers'
							className='w-12 h-12 sm:w-20 sm:h-20 mb-3 sm:mb-4 group-hover:scale-110 group-hover:filter transition-transform duration-300'
						/>
						<span className='font-semibold text-xs sm:text-lg text-center'>
							EXISTING PASSENGERS
						</span>
					</button>
				</div>
			</div>
		</div>
	);
};

export default BookingDashboard;
