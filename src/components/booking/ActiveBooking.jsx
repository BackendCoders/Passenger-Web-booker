/** @format */
import React from 'react';
import { useState, useEffect, useMemo } from 'react';
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
	IconButton,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from '@mui/material';
import { FaArrowUp } from 'react-icons/fa6';
import { FaArrowDown } from 'react-icons/fa6';
import { FaMinus, FaPlus } from 'react-icons/fa';

import {
	fetchActiveBookings,
	amendBooking,
	cancelBooking,
} from '../../slices/activeSlice';
import Header from '../Common/header';
import { toast } from 'react-hot-toast';
import { debounce } from 'lodash';

// Row Component for Each Booking
function Row({ row, isParent, isOpen, toggleGroup }) {
	const dispatch = useDispatch();
	const [openAmendModal, setOpenAmendModal] = useState(false);
	const [openCancelModal, setOpenCancelModal] = useState(false);
	const [message, setMessage] = useState('');
	const [loading, setLoading] = useState(false);
	const recurrenceId = row?.recurranceId ?? 0;
	const changesPending = row?.changesPending || false; // Default to false if not present
	const applyToBlock = row?.applyToBlock || false; // Default to false if not present

	const handleAmendSubmit = async (isAmendAll = false) => {
		if (!message.trim()) {
			toast.error('Amendment message cannot be empty!');
			return;
		}

		setLoading(true);
		try {
			await dispatch(
				amendBooking({
					bookingId: row.bookingId,
					message: message,
					block: isAmendAll ? true : false,
					recurrenceId: recurrenceId,
				})
			).unwrap();
			toast.success(
				isAmendAll ? 'All Amendments Submitted' : 'Amendment Request Submitted'
			);
			setOpenAmendModal(false);
			setMessage('');
		} catch (error) {
			toast.error('Failed to amend booking.');
		}
		setLoading(false);
	};

	const handleCancelSubmit = async (isCancelAll = false) => {
		setLoading(true);
		try {
			await dispatch(
				cancelBooking({
					bookingId: row.bookingId,
					block: isCancelAll ? true : false,
					recurrenceId: recurrenceId,
				})
			).unwrap();
			toast.success(
				isCancelAll
					? 'All Bookings Cancelled'
					: 'Booking cancelled successfully!'
			);
			setOpenCancelModal(false);
		} catch (error) {
			toast.error('Failed to cancel booking.');
		}
		setLoading(false);
	};

	return (
		<>
			<TableRow>
				<TableCell>
					{isParent && (
						<IconButton
							size='small'
							onClick={() => toggleGroup(row.recurranceId || 0)}
						>
							{isOpen ? <FaMinus /> : <FaPlus />}
						</IconButton>
					)}
				</TableCell>

				{isParent ? (
					<TableCell colSpan={6}>
						<Box
							display='flex'
							justifyContent='space-between'
							alignItems='center'
						>
							<span
								style={{
									fontWeight: '600', // Medium bold (lighter than 700, but noticeable)
									fontSize: '1rem', // Slightly larger size
									color: '#1f2937', // Darker text for contrast
								}}
							>
								{row.passengerName}
							</span>
							{recurrenceId !== null &&
								recurrenceId !== 0 &&
								!applyToBlock && ( // Hide buttons if applyToBlock is true
									<Box
										display='flex'
										gap={1}
									>
										<Button
											variant='contained'
											size='small'
											sx={{
												'backgroundColor': 'gray',
												'color': 'white',
												'padding': '6px 16px',
												'fontWeight': 'bold',
												'borderRadius': '6px',
												'textTransform': 'capitalize',
												// '&:hover': { backgroundColor: '#0284c7' },
											}}
											// onClick={() => setOpenAmendModal(true)}
										>
											Amend All
										</Button>
										<Button
											variant='contained'
											size='small'
											sx={{
												'backgroundColor': '#dc2626',
												'color': 'white',
												'padding': '6px 16px',
												'fontWeight': 'bold',
												'borderRadius': '6px',
												'textTransform': 'capitalize',
												'&:hover': { backgroundColor: '#b91c1c' },
											}}
											onClick={() => setOpenCancelModal(true)}
										>
											Cancel All
										</Button>
									</Box>
								)}
						</Box>
					</TableCell>
				) : (
					<>
						<TableCell>{row.bookingId}</TableCell>
						<TableCell>
							{moment(row.dateTime).format('DD-MM-YYYY HH:mm')}
						</TableCell>
						<TableCell>{row.passengerName}</TableCell>
						<TableCell>{row.pickupAddress}</TableCell>
						<TableCell>{row.destinationAddress}</TableCell>
						<TableCell sx={{ padding: '8px', textAlign: 'center' }}>
							<Box
								display='flex'
								justifyContent='center'
								gap={1}
							>
								{!changesPending && ( // Hide buttons if changesPending is true
									<Button
										variant='contained'
										size='small'
										sx={{
											'backgroundColor': 'gray',
											'color': 'white',
											'padding': '6px 16px',
											'fontWeight': 'bold',
											'borderRadius': '6px',
											'textTransform': 'capitalize',
											// '&:hover': { backgroundColor: '#0284c7' },
										}}
										// onClick={() => setOpenAmendModal(true)}
									>
										Amend
									</Button>
								)}
								{!changesPending && ( // Hide buttons if changesPending is true
									<Button
										variant='contained'
										size='small'
										sx={{
											'backgroundColor': '#dc2626',
											'color': 'white',
											'padding': '6px 16px',
											'fontWeight': 'bold',
											'borderRadius': '6px',
											'textTransform': 'capitalize',
											'&:hover': { backgroundColor: '#b91c1c' },
										}}
										onClick={() => setOpenCancelModal(true)}
									>
										Cancel
									</Button>
								)}
							</Box>
						</TableCell>
					</>
				)}
			</TableRow>

			{/* Amend Booking Modal */}
			<Dialog
				open={openAmendModal}
				onClose={() => setOpenAmendModal(false)}
				maxWidth='sm'
				fullWidth
				sx={{
					'& .MuiDialog-paper': {
						borderRadius: '16px', // Matched with Cancel Booking Modal
						boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
						backgroundColor: '#ffffff',
						padding: '8px', // Slight padding for overall container
						fontFamily: 'Arial, sans-serif', // Match font from image
					},
				}}
			>
				<DialogTitle
					sx={{
						backgroundColor: '#ffffff', // White background (matches Cancel Booking Modal)
						color: '#4a5568', // Dark gray title color (matches image)
						textAlign: 'center',
						fontWeight: 'bold',
						padding: '16px 24px',
						fontSize: '1.25rem', // Slightly larger font like image
						borderBottom: '1px solid #e2e8f0', // Light border for separation
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
				>
					Amend Booking
					<IconButton
						onClick={() => setOpenAmendModal(false)}
						sx={{
							color: '#a0aec0', // Light gray for close icon (matches image)
							p: 0.5, // Smaller padding for icon button
						}}
					>
						<span style={{ fontSize: '24px', lineHeight: '1' }}>×</span>
					</IconButton>
				</DialogTitle>
				<DialogContent
					sx={{
						textAlign: 'center',
						padding: '24px',
						backgroundColor: '#ffffff', // White background for content
						fontSize: '0.875rem', // Default text size as per image
						color: '#4a5568', // Dark gray text (matches image)
					}}
				>
					<TextField
						label='Enter amendment message'
						variant='outlined'
						fullWidth
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						sx={{
							'marginTop': 2,
							'& .MuiOutlinedInput-root': {
								'borderRadius': '8px',
								'& .MuiOutlinedInput-input': {
									fontSize: '0.875rem', // Match input text size
									color: '#4a5568', // Dark gray text
								},
								'& .MuiInputLabel-root': {
									fontSize: '0.875rem', // Match label text size
									color: '#4a5568', // Dark gray label
								},
								'& .MuiOutlinedInput-notchedOutline': {
									borderColor: '#e2e8f0', // Light gray border
								},
							},
						}}
					/>
				</DialogContent>
				<DialogActions
					sx={{
						justifyContent: 'center',
						padding: '16px 24px',
						backgroundColor: '#ffffff', // White background for actions
						gap: '12px', // Space between buttons
					}}
				>
					<Button
						onClick={() => setOpenAmendModal(false)}
						sx={{
							'backgroundColor': '#ffffff',
							'color': '#4a5568',
							'padding': '8px 24px',
							'fontWeight': 'bold',
							'borderRadius': '8px',
							'border': '1px solid #e2e8f0', // Light border like image
							'textTransform': 'none', // No uppercase (matches image)
							'fontSize': '0.875rem', // Match button text size
							'&:hover': { backgroundColor: '#edf2f7', borderColor: '#cbd5e0' }, // Light gray hover
						}}
						disabled={loading}
					>
						Cancel
					</Button>
					{isParent ? (
						<Button
							onClick={() => handleAmendSubmit(true)}
							sx={{
								'backgroundColor': '#0ea5e9', // Blue button color
								'color': 'white',
								'padding': '8px 24px',
								'fontWeight': 'bold',
								'borderRadius': '8px',
								'textTransform': 'none', // No uppercase (matches image)
								'fontSize': '0.875rem', // Match button text size
								'&:hover': { backgroundColor: '#0284c7' }, // Darker blue on hover
							}}
							disabled={loading}
						>
							Submit All Future Bookings
						</Button>
					) : (
						<Button
							onClick={() => handleAmendSubmit(false)}
							sx={{
								'backgroundColor': '#e53e3e', // Red button color (matches Cancel modal for Submit)
								'color': 'white',
								'padding': '8px 24px',
								'fontWeight': 'bold',
								'borderRadius': '8px',
								'textTransform': 'none', // No uppercase (matches image)
								'fontSize': '0.875rem', // Match button text size
								'&:hover': { backgroundColor: '#c53030' }, // Darker red on hover
							}}
							disabled={loading}
						>
							Submit
						</Button>
					)}
				</DialogActions>
			</Dialog>

			{/* Cancel Booking Modal */}
			<Dialog
				open={openCancelModal}
				onClose={() => setOpenCancelModal(false)}
				maxWidth='sm'
				fullWidth
				sx={{
					'& .MuiDialog-paper': {
						borderRadius: '16px',
						boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
						backgroundColor: '#ffffff',
						padding: '8px', // Slight padding for overall container
						fontFamily: 'Arial, sans-serif', // Match font from image
					},
				}}
			>
				<DialogTitle
					sx={{
						backgroundColor: '#ffffff', // White background for title (matches image)
						color: '#4a5568', // Dark gray title color (matches image)
						textAlign: 'center',
						fontWeight: 'bold',
						padding: '16px 24px',
						fontSize: '1.25rem', // Slightly larger font like image
						borderBottom: '1px solid #e2e8f0', // Light border for separation
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
				>
					Cancel Booking
					<IconButton
						onClick={() => setOpenCancelModal(false)}
						sx={{
							color: '#a0aec0', // Light gray for close icon (matches image)
							p: 0.5, // Smaller padding for icon button
						}}
					>
						<span style={{ fontSize: '24px', lineHeight: '1' }}>×</span>
					</IconButton>
				</DialogTitle>
				<DialogContent
					sx={{
						textAlign: 'center',
						padding: '24px',
						backgroundColor: '#ffffff', // White background for content
						fontSize: '0.875rem', // Default text size as per image
						color: '#4a5568', // Dark gray text (matches image)
					}}
				>
					<Box
						sx={{
							color: '#e53e3e', // Red warning icon color (matches image)
							mb: 2,
							display: 'flex',
							justifyContent: 'center',
						}}
					>
						<span style={{ fontSize: '20px' }}>⚠</span>{' '}
						{/* Slightly larger warning icon */}
					</Box>
					<p>
						Are you sure you want to submit a cancellation request for: <br />
						<strong style={{ color: '#4a5568', fontWeight: 'bold' }}>
							{row.passengerName || 'Unknown Passenger'}
						</strong>
					</p>
				</DialogContent>
				<DialogActions
					sx={{
						justifyContent: 'center',
						padding: '16px 24px',
						backgroundColor: '#ffffff', // White background for actions
						gap: '12px', // Space between buttons
					}}
				>
					<Button
						onClick={() => setOpenCancelModal(false)}
						sx={{
							'backgroundColor': '#ffffff',
							'color': '#4a5568',
							'padding': '8px 24px',
							'fontWeight': 'bold',
							'borderRadius': '8px',
							'border': '1px solid #e2e8f0', // Light border like image
							'textTransform': 'none', // No uppercase (matches image)
							'fontSize': '0.875rem', // Match button text size
							'&:hover': { backgroundColor: '#edf2f7', borderColor: '#cbd5e0' }, // Light gray hover
						}}
					>
						Cancel
					</Button>
					{isParent ? (
						<Button
							onClick={() => handleCancelSubmit(true)}
							sx={{
								'backgroundColor': '#e53e3e', // Red button color (matches image)
								'color': 'white',
								'padding': '8px 24px',
								'fontWeight': 'bold',
								'borderRadius': '8px',
								'textTransform': 'none', // No uppercase (matches image)
								'fontSize': '0.875rem', // Match button text size
								'&:hover': { backgroundColor: '#c53030' }, // Darker red on hover
							}}
							disabled={loading}
						>
							Cancel This and Future Bookings
						</Button>
					) : (
						<Button
							onClick={() => handleCancelSubmit(false)}
							sx={{
								'backgroundColor': '#e53e3e', // Red button color (matches image)
								'color': 'white',
								'padding': '8px 24px',
								'fontWeight': 'bold',
								'borderRadius': '8px',
								'textTransform': 'none', // No uppercase (matches image)
								'fontSize': '0.875rem', // Match button text size
								'&:hover': { backgroundColor: '#c53030' }, // Darker red on hover
							}}
							disabled={loading}
						>
							Cancel This Booking Only
						</Button>
					)}
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
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(20);
	const [searchInput, setSearchInput] = useState('');
	const [searchTerm, setSearchTerm] = useState('');
	const [sortConfig, setSortConfig] = useState({
		key: 'bookingId',
		direction: 'desc',
	});
	const [openGroups, setOpenGroups] = useState({});

	const handleSort = (key) => {
		let direction = 'desc';
		if (sortConfig.key === key && sortConfig.direction === 'desc') {
			direction = 'asc';
		}
		setSortConfig({ key, direction });
	};

	const filteredBookings = useMemo(() => {
		return activeBookings.filter((booking) => {
			const searchableFields = [
				'passengerName',
				'pickupAddress',
				'destinationAddress',
				'bookingId',
			];
			return searchableFields.some((field) =>
				String(booking[field] || '')
					.toLowerCase()
					.includes(searchTerm.toLowerCase())
			);
		});
	}, [activeBookings, searchTerm]);

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

	const handleSearchChange = debounce((value) => {
		setSearchTerm(value);
	}, 300);

	useEffect(() => {
		dispatch(fetchActiveBookings());
	}, [dispatch]);

	// Group bookings by recurrenceId
	const groupedBookings = useMemo(() => {
		const groups = {};
		sortedBookings.forEach((booking) => {
			const key = booking.recurranceId || 0; // Use 0 for non-recurring bookings
			if (!groups[key]) {
				groups[key] = booking; // Store first booking as parent
			}
		});
		return groups;
	}, [sortedBookings]);

	const totalFilteredBookings = Object.keys(groupedBookings).length || 0;
	const startIndex = page * rowsPerPage;
	const endIndex = Math.min(startIndex + rowsPerPage, totalFilteredBookings);
	const paginatedParentBookings = Object.values(groupedBookings).slice(
		startIndex,
		endIndex
	);

	const paginatedBookings = useMemo(() => {
		if (totalFilteredBookings === 0) return {};
		const finalGroups = {};
		paginatedParentBookings.forEach((parentBooking) => {
			const key = parentBooking.recurranceId || 0;
			finalGroups[key] = sortedBookings.filter(
				(booking) => (booking.recurranceId || 0) === key
			);
		});
		return finalGroups;
	}, [paginatedParentBookings, sortedBookings, totalFilteredBookings]);

	const toggleGroup = (groupId) => {
		setOpenGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
	};

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
							handleSearchChange(e.target.value);
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
									<TableCell />
									<TableCell
										sx={{
											color: 'white',
											fontWeight: 'bold',
											cursor: 'pointer',
											borderBottom: 'none',
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
											borderBottom: 'none',
										}}
										onClick={() => handleSort('dateTime')}
									>
										<span
											style={{ display: 'inline-flex', alignItems: 'center' }}
										>
											Date & Time{' '}
											{sortConfig.key === 'dateTime' &&
												(sortConfig.direction === 'asc' ? (
													<FaArrowUp />
												) : (
													<FaArrowDown />
												))}
										</span>
									</TableCell>
									<TableCell
										sx={{
											color: 'white',
											fontWeight: 'bold',
											cursor: 'pointer',
											borderBottom: 'none',
										}}
										onClick={() => handleSort('passengerName')}
									>
										<span
											style={{ display: 'inline-flex', alignItems: 'center' }}
										>
											Passenger{' '}
											{sortConfig.key === 'passengerName' &&
												(sortConfig.direction === 'asc' ? (
													<FaArrowUp />
												) : (
													<FaArrowDown />
												))}
										</span>
									</TableCell>
									<TableCell
										sx={{
											color: 'white',
											fontWeight: 'bold',
											cursor: 'pointer',
											borderBottom: 'none',
										}}
										onClick={() => handleSort('pickupAddress')}
									>
										<span
											style={{ display: 'inline-flex', alignItems: 'center' }}
										>
											Pickup Address{' '}
											{sortConfig.key === 'pickupAddress' &&
												(sortConfig.direction === 'asc' ? (
													<FaArrowUp />
												) : (
													<FaArrowDown />
												))}
										</span>
									</TableCell>
									<TableCell
										sx={{
											color: 'white',
											fontWeight: 'bold',
											cursor: 'pointer',
											borderBottom: 'none',
										}}
										onClick={() => handleSort('destinationAddress')}
									>
										<span
											style={{ display: 'inline-flex', alignItems: 'center' }}
										>
											Destination{' '}
											{sortConfig.key === 'destinationAddress' &&
												(sortConfig.direction === 'asc' ? (
													<FaArrowUp />
												) : (
													<FaArrowDown />
												))}
										</span>
									</TableCell>
									<TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
										Actions
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{Object.keys(paginatedBookings).length > 0 ? (
									Object.keys(paginatedBookings).map((groupId) => {
										const bookings = paginatedBookings[groupId];
										const firstBooking = bookings[0];

										return (
											<React.Fragment key={groupId}>
												<Row
													row={firstBooking}
													isParent={bookings.length > 1}
													isOpen={!!openGroups[groupId]}
													toggleGroup={toggleGroup}
												/>
												{openGroups[groupId] &&
													bookings.slice(1).map((booking) => (
														<Row
															key={booking.bookingId}
															row={booking}
														/>
													))}
											</React.Fragment>
										);
									})
								) : (
									<TableRow>
										<TableCell
											colSpan={7}
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

				<div className='flex flex-col md:flex-row justify-between items-center mt-4 gap-2 w-full'>
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
							{startIndex + 1} - {endIndex} of {totalFilteredBookings || 1}
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
