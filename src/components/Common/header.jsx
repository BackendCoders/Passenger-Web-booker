/** @format */
import { useLocation, useNavigate } from 'react-router-dom'; // Import useLocation
import carlogo from '../../assets/acelogo.png'; // Replace with the correct path to your logo image
import { FaAngleDown } from 'react-icons/fa';
import { useState } from 'react';

const Header = () => {
	const location = useLocation();
	const navigate = useNavigate(); // For navigation
	const [dropdownOpen, setDropdownOpen] = useState(false); // Dropdown state

	// Handle logout
	const handleLogout = () => {
		navigate('/'); // Navigate to the logout route
	};

	// Define headings for different routes
	const routeHeadings = {
		'/': 'ACE TAXIS - ACCOUNT WEB BOOKING',
		'/dashboard': 'DASHBOARD',
		'/AddPassenger': 'ADD PASSENGER',
		'/passengerlist': 'PASSENGER LIST',
		'/existingPassengers': 'EXISTING PASSENGERS',
		'/createbookingform': 'CREATE BOOKING FORM',
	};

	// Determine heading based on current route
	const currentHeading =
		routeHeadings[location.pathname] || 'ACE TAXIS - ACCOUNT WEB BOOKING';

	return (
		<header className='bg-white p-4 flex flex-col sm:flex-row items-center justify-between'>
			{/* Left Section: Logo */}
			<div className='flex items-center space-x-3'>
				<img
					src={carlogo}
					alt='Logo'
					className='w-10 h-10 sm:w-12 sm:h-12 rounded-md object-contain' // Logo styling
				/>
			</div>

			{/* Center Section: Title */}
			<div className='flex-grow text-center'>
				<h1 className='text-lg sm:text-2xl font-extrabold text-black-700'>
					ACE TAXIS - ACCOUNT WEB BOOKING {currentHeading}{' '}
					{/* Dynamic Heading */}
				</h1>
			</div>

			{/* Right Section: Account Info */}
			<div className='relative text-center sm:text-right text-xs sm:text-base text-gray-700 mt-3 sm:mt-0'>
				<div
					className=' space-x-1 cursor-pointer'
					onClick={() => setDropdownOpen(!dropdownOpen)} // Toggle dropdown
				>
					<p className='font-medium'>9015 - Harbour Vale Acc</p>
					<p className='text-gray-500 flex items-center'>
						Logged in as:{' '}
						<span className='font-semibold ml-1'>Peter Farrell</span>
						<FaAngleDown className='ml-1' />
					</p>
				</div>

				{/* Dropdown Menu */}
				{dropdownOpen && (
					<div className='absolute right-0 mt-2 w-48 bg-white border border-gray-300 shadow-md rounded-md z-10'>
						<button
							onClick={handleLogout}
							className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
						>
							Logout
						</button>
					</div>
				)}
			</div>
		</header>
	);
};

export default Header;
