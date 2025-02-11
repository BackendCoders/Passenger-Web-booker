/** @format */

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Header from '../Common/header'; // ✅ Using the same Header
import { TiArrowBack } from 'react-icons/ti';

const HistoryBooking = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { token = '', username, userId } = useSelector((state) => state.auth);

	const [bookings, setBookings] = useState([]); // ✅ Store booking history
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [searchTerm, setSearchTerm] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [rowsPerPage, setRowsPerPage] = useState(5); // Default rows per page

	// ✅ Fetch booking history when the component mounts
	useEffect(() => {
		const fetchBookingHistory = async () => {
			try {
				setLoading(true);
				// Fetch bookings from API or Redux
				const response = await fetch('/api/bookings', {
					headers: { Authorization: `Bearer ${token}` },
				});
				if (!response.ok) throw new Error('Failed to fetch bookings');
				const data = await response.json();
				setBookings(data);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};
		fetchBookingHistory();
	}, [dispatch, token]);

	// ✅ Filter bookings based on search term
	const filteredBookings = bookings.filter((booking) => {
		if (!booking) return false;
		return (
			booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			booking.bookingDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
			booking.status.toLowerCase().includes(searchTerm.toLowerCase())
		);
	});

	// ✅ Pagination logic
	const totalPages = Math.ceil(filteredBookings.length / rowsPerPage);
	const startIndex = (currentPage - 1) * rowsPerPage;
	const currentBookings = filteredBookings.slice(startIndex, startIndex + rowsPerPage);

	// ✅ Reset to first page when search term changes
	useEffect(() => {
		setCurrentPage(1);
	}, [searchTerm, rowsPerPage]);

	return (
		<div>
			<Header />
			<div className='bg-white pt-10 p-4 flex flex-col items-center min-h-[500px] max-h-[70vh] overflow-y-auto sm:min-h-screen sm:max-h-full'>
				{/* ✅ Back Button */}
				<button
					onClick={() => navigate('/')}
					className='flex-shrink-0 px-3 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition flex items-center justify-center mb-4'
				>
					<TiArrowBack className='mr-2' />
					<span className='font-medium'>Back</span>
				</button>

				{/* ✅ Search Bar */}
				<input
					type='text'
					placeholder='Search bookings...'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className='px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none text-sm mb-4 w-full max-w-md'
				/>

				{/* ✅ Error Message */}
				{error && <p className='text-red-500 text-center mb-4'>{error}</p>}

				{/* ✅ Loading Spinner */}
				{loading && <p className='text-center mb-4'>Loading...</p>}

				{/* ✅ Booking History Table */}
				{!loading && filteredBookings.length > 0 && (
					<div className='w-full max-w-7xl bg-white p-8 rounded-lg shadow-lg'>
						<div className='overflow-auto max-h-[70vh]'>
							{/* ✅ Desktop View */}
							<table className='hidden md:table min-w-full border-collapse border border-gray-300'>
								<thead>
									<tr className='bg-[#b91c1c] text-white sticky top-0 z-10'>
										<th className='border border-gray-300 px-4 py-2 text-left'>Customer</th>
										<th className='border border-gray-300 px-4 py-2 text-left'>Booking Date</th>
										<th className='border border-gray-300 px-4 py-2 text-left'>Status</th>
										<th className='border border-gray-300 px-4 py-2 text-left'>Amount</th>
									</tr>
								</thead>
								<tbody>
									{currentBookings.map((booking, index) => (
										<tr
											key={index}
											className={`${index % 2 === 0 ? 'bg-red-50' : 'bg-white'} hover:bg-red-100`}
										>
											<td className='border border-gray-300 px-4 py-2'>{booking.customerName || 'N/A'}</td>
											<td className='border border-gray-300 px-4 py-2'>{booking.bookingDate || 'N/A'}</td>
											<td className='border border-gray-300 px-4 py-2'>{booking.status || 'N/A'}</td>
											<td className='border border-gray-300 px-4 py-2'>${booking.amount || '0.00'}</td>
										</tr>
									))}
								</tbody>
							</table>

							{/* ✅ Mobile View */}
							<div className='md:hidden flex flex-col gap-4'>
								{currentBookings.map((booking, index) => (
									<div
										key={index}
										className='bg-white border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300'
									>
										<h3 className='text-lg font-semibold text-red-700'>{booking.customerName || 'N/A'}</h3>
										<p className='text-gray-600'><span className='font-semibold'>Date:</span> {booking.bookingDate || 'N/A'}</p>
										<p className='text-gray-600'><span className='font-semibold'>Status:</span> {booking.status || 'N/A'}</p>
										<p className='text-gray-600'><span className='font-semibold'>Amount:</span> ${booking.amount || '0.00'}</p>
									</div>
								))}
							</div>
						</div>

						{/* ✅ Pagination Controls */}
						<div className='flex flex-col md:flex-row justify-between items-center mt-4 gap-2'>
							<div className='flex items-center gap-2'>
								<label htmlFor='rowsPerPage' className='text-sm text-black font-medium'>Rows:</label>
								<select
									id='rowsPerPage'
									value={rowsPerPage}
									onChange={(e) => setRowsPerPage(Number(e.target.value))}
									className='px-2 py-1 text-sm border border-gray-300 bg-white text-black rounded-md focus:outline-none hover:bg-red-50'
								>
									<option value={5}>5</option>
									<option value={10}>10</option>
									<option value={20}>20</option>
								</select>
							</div>

							<div className='flex items-center gap-2'>
								<button disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)} className='px-3 py-1 text-sm text-white bg-[#b91c1c] rounded-md hover:bg-red-700 transition'>
									Prev
								</button>
								<p className='text-sm'>{startIndex + 1}-{Math.min(startIndex + rowsPerPage, filteredBookings.length)} of {filteredBookings.length}</p>
								<button disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => prev + 1)} className='px-3 py-1 text-sm text-white bg-[#b91c1c] rounded-md hover:bg-red-700 transition'>
									Next
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default HistoryBooking;
