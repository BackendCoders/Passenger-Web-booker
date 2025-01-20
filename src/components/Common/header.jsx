/** @format */
import { useLocation, useNavigate } from 'react-router-dom'; // Import useLocation
import carlogo from '../../assets/logo.png'; // Replace with the correct path to your logo image
import { FaAngleDown } from 'react-icons/fa';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../service/operations/authApi';
import { useSelector } from 'react-redux'; // Redux hooks
import { RiLogoutBoxLine } from 'react-icons/ri';
import { useEffect } from 'react';

const Header = () => {
	const location = useLocation();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [dropdownOpen, setDropdownOpen] = useState(false); // Dropdown state
	const [fullName, setFullName] = useState(""); // State for fullName

	// Retrieve fullName from localStorage on component mount
	useEffect(() => {
		const storedName = localStorage.getItem("fullName");
		setFullName(storedName || "Guest"); // Default to "Guest" if no fullName found
	  }, []);
     
	  
	// Access loading and error state from Redux
	// const { fullName } = useSelector((state) => state.auth);
	// console.log(fullName);

	// Handle logout
	// const handleLogout = () => {
	// 	navigate('/'); // Navigate to the logout route
	// };

	// Define headings for different routes
	const routeHeadings = {
		'/': 'DASHBOARD',
		'/dashboard': 'DASHBOARD',
		'/AddPassenger': 'ADD PASSENGER',
		'/passengerlist': 'PASSENGER LIST',
		'/existingPassengers': 'EXISTING PASSENGERS',
		'/createbookingform': 'CREATE BOOKING FORM',
		'/confirmation': 'CONFIRMATION',
	};

	// Determine heading based on current route
	const currentHeading =
		routeHeadings[location.pathname] || 'ACE TAXIS - ACCOUNT WEB BOOKING';

	return (
		<header
			className='p-4 flex flex-col sm:flex-row items-center justify-between'
			style={{ backgroundColor: '#cd1a21' }}
		>
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
				<h1 className='text-lg sm:text-2xl font-extrabold text-white font-mono'>
					ACCOUNT WEB BOOKING - {currentHeading} {/* Dynamic Heading */}
				</h1>
			</div>

			{/* Right Section: Account Info */}
			<div className='relative text-center sm:text-right text-xs sm:text-base text-gray-700 mt-3 sm:mt-0'>
				<div
					className='space-x-1 cursor-pointer'
					onClick={() => setDropdownOpen(!dropdownOpen)} // Toggle dropdown
				>
					<p className='font-medium text-white'>9015 - Harbour Vale Acc</p>
					<p className='text-white flex items-center'>
						Logged in as: <span className='font-semibold ml-1'>{fullName}</span>
						<FaAngleDown
							className={`ml-1 transform transition-transform duration-200 ${
								dropdownOpen ? 'rotate-0' : 'rotate-180'
							}`} // Arrow rotation based on dropdown state
						/>
					</p>
				</div>

				{/* Dropdown Menu */}
				{dropdownOpen && (
					<div className='absolute right-0 mt-2 w-48 bg-white border border-gray-300 shadow-md rounded-md z-10'>
						<button
							onClick={() => dispatch(logout(navigate))}
							className='flex items-center justify-start w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
						>
							<RiLogoutBoxLine className='text-xl mr-2' /> {/* Logout icon */}
							<span>Log Out</span> {/* Logout text */}
						</button>
					</div>
				)}
			</div>
		</header>
	);
};

export default Header;
