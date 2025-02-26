/** @format */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { TiArrowBack } from 'react-icons/ti';
import moment from 'moment';
import {
	Box,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Button,
	TextField,
	CircularProgress,
} from '@mui/material';
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from '@mui/material';

import {
	fetchActiveBookings,
	amendBooking,
	cancelBooking,
} from '../../slices/activeSlice';
import Header from '../Common/header';
import { toast } from 'react-hot-toast';
import { useMemo } from 'react';
import { debounce } from 'lodash';
import { FaArrowUp } from 'react-icons/fa6';
import { FaArrowDown } from 'react-icons/fa6';

// Row Component for Each Booking
function Row({ row }) {
	const dispatch = useDispatch();
	const [openAmendModal, setOpenAmendModal] = useState(false);
	const [openCancelModal, setOpenCancelModal] = useState(false);
	const [message, setMessage] = useState('');
	const [loading, setLoading] = useState(false);

	// Handle Amendment Submission
	const handleAmendSubmit = async () => {
		if (!message.trim()) {
			toast.error('Amendment message cannot be empty!');
			return;
		}
		setLoading(true);
		try {
			await dispatch(
				amendBooking({ bookingId: row.bookingId, message })
			).unwrap();
			toast.success('Amendment Request Submitted');
			setOpenAmendModal(false);
			setMessage('');
		} catch (error) {
			toast.error('Failed to amend booking.');
		}
		setLoading(false);
	};

	// Handle Cancellation Submission
	const handleCancelSubmit = async () => {
		setLoading(true);
		try {
			await dispatch(cancelBooking(row.bookingId)).unwrap();
			toast.success('Booking cancelled successfully!');
			setOpenCancelModal(false);
		} catch (error) {
			toast.error('Failed to cancel booking.');
		}
		setLoading(false);
	};

	return (
		<>
			<TableRow>
				<TableCell>{row.bookingId}</TableCell>
				<TableCell>{moment(row.dateTime).format('DD-MM-YYYY hh:mm')}</TableCell>
				<TableCell>{row.passengerName}</TableCell>
				<TableCell>{row.pickupAddress}</TableCell>
				<TableCell>{row.destinationAddress}</TableCell>
				<TableCell sx={{ padding: '8px', textAlign: 'center' }}>
					<Box
						display='flex'
						justifyContent='center'
						gap={1}
					>
						<Button
							variant='contained'
							size='small'
							sx={{
								'backgroundColor': '#0ea5e9', // ✅ Slightly darker blue
								'color': 'white',
								'padding': '6px 16px',
								'fontWeight': 'bold',
								'borderRadius': '6px',
								'textTransform': 'capitalize',
								'&:hover': { backgroundColor: '#0284c7' }, // ✅ Darker shade on hover
							}}
							onClick={() => setOpenAmendModal(true)}
						>
							Amend
						</Button>

						<Button
							variant='contained'
							size='small'
							sx={{
								'backgroundColor': '#dc2626', // ✅ Red color matching the theme
								'color': 'white',
								'padding': '6px 16px',
								'fontWeight': 'bold',
								'borderRadius': '6px',
								'textTransform': 'capitalize',
								'&:hover': { backgroundColor: '#b91c1c' }, // ✅ Darker red on hover
							}}
							onClick={() => setOpenCancelModal(true)}
						>
							Cancel
						</Button>
					</Box>
				</TableCell>
			</TableRow>

			{/* ✅ Amend Booking Modal */}
			<Dialog
				open={openAmendModal}
				onClose={() => setOpenAmendModal(false)}
				maxWidth='sm'
				fullWidth
			>
				<DialogTitle
					sx={{
						backgroundColor: '#dc2626',
						color: 'white',
						textAlign: 'center',
						fontWeight: 'bold', // ✅ Consistent styling
						padding: '12px', // ✅ Added padding
					}}
				>
					Amend Booking
				</DialogTitle>
				<DialogContent sx={{ textAlign: 'center', padding: '20px' }}>
					<TextField
						label='Enter amendment message'
						variant='outlined'
						fullWidth
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						sx={{
							'marginTop': 2,
							'& .MuiOutlinedInput-root': { borderRadius: '8px' }, // ✅ Rounded corners
						}}
					/>
				</DialogContent>
				<DialogActions sx={{ justifyContent: 'center', paddingBottom: 2 }}>
					<Button
						onClick={() => setOpenAmendModal(false)}
						sx={{
							'backgroundColor': '#dc2626',
							'color': 'white',
							'padding': '6px 16px', // ✅ Consistent padding
							'fontWeight': 'bold',
							'borderRadius': '6px',
							'&:hover': { backgroundColor: '#b91c1c' }, // ✅ Hover effect
						}}
						disabled={loading}
					>
						Cancel
					</Button>
					<Button
						onClick={handleAmendSubmit}
						sx={{
							'backgroundColor': 'gray',
							'color': 'white',
							'padding': '6px 16px',
							'fontWeight': 'bold',
							'borderRadius': '6px',
							'&:hover': { backgroundColor: '#4b4b4b' },
						}}
						disabled={loading}
					>
						{loading ? (
							<CircularProgress
								size={20}
								sx={{ color: 'white' }}
							/>
						) : (
							'Submit'
						)}
					</Button>
				</DialogActions>
			</Dialog>

			{/* ✅ Cancellation Confirmation Modal */}
			<Dialog
				open={openCancelModal}
				onClose={() => setOpenCancelModal(false)}
				maxWidth='sm'
				fullWidth
			>
				<DialogTitle
					sx={{
						backgroundColor: '#dc2626',
						color: 'white',
						textAlign: 'center',
						fontWeight: 'bold',
						padding: '12px',
					}}
				>
					Cancel Booking
				</DialogTitle>
				<DialogContent sx={{ textAlign: 'center', padding: '20px' }}>
					Are you sure you want to submit a cancellation request for{' '}
					<strong>{row.passengerName}</strong>?
				</DialogContent>
				<DialogActions sx={{ justifyContent: 'center', paddingBottom: 2 }}>
					<Button
						onClick={() => setOpenCancelModal(false)}
						sx={{
							'backgroundColor': '#dc2626',
							'color': 'white',
							'padding': '6px 16px',
							'fontWeight': 'bold',
							'borderRadius': '6px',
							'&:hover': { backgroundColor: '#b91c1c' },
						}}
						disabled={loading}
					>
						No
					</Button>
					<Button
						onClick={handleCancelSubmit}
						sx={{
							'backgroundColor': 'gray',
							'color': 'white',
							'padding': '6px 16px',
							'fontWeight': 'bold',
							'borderRadius': '6px',
							'&:hover': { backgroundColor: '#4b4b4b' },
						}}
						disabled={loading}
					>
						{loading ? (
							<CircularProgress
								size={20}
								sx={{ color: 'white' }}
							/>
						) : (
							'Yes, Cancel'
						)}
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}

Row.propTypes = {
	row: PropTypes.object.isRequired,
};

const ActiveBooking = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { activeBookings, loading } = useSelector(
		(state) => state.activebookings
	);
	// const [searchTerm, setSearchTerm] = useState('');
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(20);
	const [searchInput, setSearchInput] = useState('');
	const [searchTerm, setSearchTerm] = useState('');
	const [sortConfig, setSortConfig] = useState({
		key: 'bookingId',
		direction: 'desc',
	});

	const handleSort = (key) => {
		let direction = 'desc'; // Default desc

		if (sortConfig.key === key && sortConfig.direction === 'desc') {
			direction = 'asc';
		}

		setSortConfig({ key, direction });
	};

	// Filter Bookings Based on Search
	const filteredBookings = useMemo(() => {
		return activeBookings.filter((booking) => {
			// Fields where the search will be applied
			const searchableFields = [
				'passengerName',
				'pickupAddress',
				'destinationAddress',
				'bookingId',
			];

			// Check if searchTerm is present in any of these fields
			return searchableFields.some((field) =>
				String(booking[field] || '')
					.toLowerCase()
					.includes(searchTerm.toLowerCase())
			);
		});
	}, [activeBookings, searchTerm]); // Recomputes only when searchTerm or activeBookings change

	const sortedBookings = useMemo(() => {
		if (!sortConfig.key) return filteredBookings;
		return [...filteredBookings].sort((a, b) => {
			const valA = a[sortConfig.key] || '';
			const valB = b[sortConfig.key] || '';

			if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
			if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
			return 0;
		});
	}, [filteredBookings, sortConfig]);

	// Debounce function to delay filtering while typing
	const handleSearchChange = debounce((value) => {
		setSearchTerm(value);
	}, 300);

	// Fetch Active Bookings on Component Mount
	useEffect(() => {
		dispatch(fetchActiveBookings());
	}, [dispatch]);

	// **Pagination Logic**
	const totalFilteredBookings = filteredBookings.length;
	const startIndex = page * rowsPerPage;
	const endIndex = Math.min(startIndex + rowsPerPage, totalFilteredBookings);
	const paginatedBookings = filteredBookings.slice(startIndex, endIndex);

	// Reset Page to 0 When Search Changes
	useEffect(() => {
		setPage(0);
	}, [searchTerm]);

	return (
		<div className='bg-white max-h-full overflow-auto'>
			<Header />
			<div className='bg-white pt-10 sm:mx-16 p-4 flex flex-col items-center min-h-[500px] sm:min-h-screen'>
				<div className='flex flex-col sm:flex-row sm:justify-center w-full mb-4 gap-3'>
					<button
						onClick={() => navigate('/')}
						className='px-3 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition flex items-center justify-center'
					>
						<TiArrowBack className='mr-2' />
						<span className='font-medium'>Back</span>
					</button>

					<TextField
						label='Search...'
						variant='outlined'
						value={searchInput}
						onChange={(e) => {
							setSearchInput(e.target.value);
							handleSearchChange(e.target.value); // Calls debounced function
						}}
						size='small'
						sx={{ width: '100%', maxWidth: '350px' }}
					/>
				</div>

				{loading ? (
					<CircularProgress />
				) : (
					<TableContainer component={Paper}>
						<Table>
							<TableHead>
								<TableRow sx={{ backgroundColor: '#545454' }}>
									<TableCell
										sx={{
											color: 'white',
											fontWeight: 'bold',
											cursor: 'pointer',
											borderBottom: 'none', // ✅ Removes white line
										}}
										onClick={() => handleSort('bookingId')}
									>
										<span
											style={{ display: 'inline-flex', alignItems: 'center' }}
										>
											Booking ID
											{sortConfig.key === 'bookingId' && (
												<span style={{ marginLeft: '8px' }}>
													{sortConfig.direction === 'asc' ? (
														<FaArrowUp />
													) : (
														<FaArrowDown />
													)}
												</span>
											)}
										</span>
									</TableCell>

									<TableCell
										sx={{
											color: 'white',
											fontWeight: 'bold',
											cursor: 'pointer',
											borderBottom: 'none', // ✅ Removes white line
										}}
										onClick={() => handleSort('dateTime')}
									>
										<span
											style={{ display: 'inline-flex', alignItems: 'center' }}
										>
											Date & Time{' '}
											{sortConfig.key === 'dateTime' ? (
												sortConfig.direction === 'asc' ? (
													<FaArrowUp />
												) : (
													<FaArrowDown />
												)
											) : (
												''
											)}
										</span>
									</TableCell>

									<TableCell
										sx={{
											color: 'white',
											fontWeight: 'bold',
											cursor: 'pointer',
											borderBottom: 'none', // ✅ Removes white line
										}}
										onClick={() => handleSort('passengerName')}
									>
										<span
											style={{ display: 'inline-flex', alignItems: 'center' }}
										>
											Passenger{' '}
											{sortConfig.key === 'passengerName' ? (
												sortConfig.direction === 'asc' ? (
													<FaArrowUp />
												) : (
													<FaArrowDown />
												)
											) : (
												''
											)}
										</span>
									</TableCell>
									<TableCell
										sx={{
											color: 'white',
											fontWeight: 'bold',
											cursor: 'pointer',
											borderBottom: 'none', // ✅ Removes white line
										}}
										onClick={() => handleSort('pickupAddress')}
									>
										<span
											style={{ display: 'inline-flex', alignItems: 'center' }}
										>
											Pickup Address{' '}
											{sortConfig.key === 'pickupAddress' ? (
												sortConfig.direction === 'asc' ? (
													<FaArrowUp />
												) : (
													<FaArrowDown />
												)
											) : (
												''
											)}
										</span>
									</TableCell>
									<TableCell
										sx={{
											color: 'white',
											fontWeight: 'bold',
											cursor: 'pointer',
											borderBottom: 'none', // ✅ Removes white line
										}}
										onClick={() => handleSort('destinationAddress')}
									>
										<span
											style={{ display: 'inline-flex', alignItems: 'center' }}
										>
											Destination{' '}
											{sortConfig.key === 'destinationAddress' ? (
												sortConfig.direction === 'asc' ? (
													<FaArrowUp />
												) : (
													<FaArrowDown />
												)
											) : (
												''
											)}
										</span>
									</TableCell>

									<TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
										Actions
									</TableCell>
								</TableRow>
							</TableHead>

							<TableBody>
								{paginatedBookings.length > 0 ? (
									sortedBookings.slice(startIndex, endIndex).map((booking) => (
										<Row
											key={booking.bookingId}
											row={booking}
										/>
									))
								) : (
									<TableRow>
										<TableCell
											colSpan={6}
											sx={{ textAlign: 'center' }}
										>
											No bookings found
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</TableContainer>
				)}

				{/* ✅ Pagination Controls */}
				<div className='flex flex-col md:flex-row justify-between items-center mt-4 gap-2 w-full'>
					{/* Rows Per Page Selector */}
					<div className='flex items-center gap-2'>
						<label
							htmlFor='rowsPerPage'
							className='text-sm md:text-base text-black font-medium'
						>
							Rows:
						</label>
						<select
							id='rowsPerPage'
							value={rowsPerPage}
							onChange={(e) => setRowsPerPage(Number(e.target.value))}
							className='px-2 py-1 text-sm border border-gray-300 bg-white text-black rounded-md focus:outline-none hover:bg-red-50'
						>
							<option value={20}>20</option>
							<option value={40}>40</option>
							<option value={80}>80</option>
							<option value={100}>100</option>
							<option value={200}>200</option>
						</select>
					</div>

					{/* Pagination Navigation */}
					<div className='flex items-center gap-2'>
						<button
							disabled={page === 0}
							onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
							className={`px-3 py-1 text-sm md:text-base text-white bg-[#b91c1c] rounded-md hover:bg-red-700 transition ${
								page === 0 ? 'opacity-50 cursor-not-allowed' : ''
							}`}
						>
							Prev
						</button>

						<p className='text-sm md:text-base'>
							{startIndex + 1} - {endIndex} of {totalFilteredBookings}
						</p>

						<button
							disabled={endIndex >= totalFilteredBookings}
							onClick={() => setPage((prev) => prev + 1)}
							className={`px-3 py-1 text-sm md:text-base text-white bg-[#b91c1c] rounded-md hover:bg-red-700 transition ${
								endIndex >= totalFilteredBookings
									? 'opacity-50 cursor-not-allowed'
									: ''
							}`}
						>
							Next
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ActiveBooking;
