/** @format */

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchPassengers, removePassenger } from '../../slices/formSlice';
import Header from '../Common/header';
import { MdDeleteForever } from 'react-icons/md';
import { TiArrowBack } from 'react-icons/ti';

const ExistingPassenger = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const {
		passengers = [],
		loading,
		error,
	} = useSelector((state) => state.forms); // Default empty array for passengers
	const [searchTerm, setSearchTerm] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [rowsPerPage, setRowsPerPage] = useState(5); // Default rows per page

	// Fetch passengers when the component mounts
	useEffect(() => {
		if (passengers.length === 0) {
			dispatch(fetchPassengers());
		}
	}, [dispatch, passengers.length]);

	// Delete passenger
	const handleDelete = (id) => {
		const token = 'static-token'; // Use actual token here
		dispatch(removePassenger({ token, id }));
	};

	// Filter passengers by search term
	const filteredPassengers = passengers.filter((passenger) => {
		if (!passenger) return false; // Ensure passenger is defined
		return (
			(passenger.passenger || '')
				.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			(passenger.description || '')
				.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			(passenger.address || '')
				.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			(passenger.postcode || '')
				.toLowerCase()
				.includes(searchTerm.toLowerCase())
		);
	});

	// Calculate pagination
	const totalPages = Math.ceil(filteredPassengers.length / rowsPerPage);
	const startIndex = (currentPage - 1) * rowsPerPage;
	const currentPassengers = filteredPassengers.slice(
		startIndex,
		startIndex + rowsPerPage
	);

	// Reset to the first page when search term changes
	useEffect(() => {
		setCurrentPage(1);
	}, [searchTerm, rowsPerPage]);

	return (
		<div>
			<Header />
			<div className=' bg-white pt-10 p-4 flex flex-col items-center  min-h-[500px] max-h-[70vh] overflow-y-auto sm:min-h-screen sm:max-h-full'>
				{/* Button Section */}
				<div className='flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4'>
					{/* Back Button */}
					<button
						onClick={() => navigate('/')}
						className='flex-shrink-0 px-3 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition flex items-center justify-center'
					>
						<TiArrowBack className='mr-2' />
						<span className='font-medium'>Back</span>
					</button>

					{/* Right Section: Buttons and Search */}
					<div className='flex flex-col md:flex-row items-center md:gap-4 w-full'>
						<div className='flex flex-wrap gap-2 justify-center md:justify-start'>
							<button
								onClick={() => navigate('/AddPassenger')}
								className='px-3 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition'
							>
								Add Passenger
							</button>

							<button
								onClick={() => navigate('/passengerlist')}
								className='px-3 py-2 bg-[#b91c1c] text-white text-sm rounded-lg hover:bg-red-700 transition'
							>
								Passenger List
							</button>
						</div>

						{/* Search Bar */}
						<input
							type='text'
							placeholder='Search passengers...'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className='mt-3 md:mt-0 flex-grow px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none text-sm'
						/>
					</div>
				</div>

				{/* Error Message */}
				{error && <p className='text-red-500 text-center mb-4'>{error}</p>}

				{/* Loading Spinner */}
				{loading && <p className='text-center mb-4'>Loading...</p>}

				{!loading && filteredPassengers.length > 0 && (
					<div className='w-full max-w-7xl bg-white p-8 rounded-lg shadow-lg'>
						{/* Responsive Table */}
						<div className='overflow-auto max-h-[70vh]'>
							{/* Desktop View */}
							<table className='hidden md:table min-w-full border-collapse border border-gray-300'>
								<thead>
									<tr className='bg-[#b91c1c] text-white sticky top-0 z-10'>
										<th className='border border-gray-300 px-4 py-2 text-left'>
											Passenger
										</th>
										<th className='border border-gray-300 px-4 py-2 text-left'>
											Description
										</th>
										<th className='border border-gray-300 px-4 py-2 text-left'>
											Address
										</th>
										<th className='border border-gray-300 px-4 py-2 text-left'>
											Postcode
										</th>
										<th className='border border-gray-300 px-4 py-2 text-left'>
											Phone
										</th>
										<th className='border border-gray-300 px-4 py-2 text-left'>
											Actions
										</th>
									</tr>
								</thead>
								<tbody>
									{currentPassengers.map((passenger, index) => (
										<tr
											key={index}
											className={`${
												index % 2 === 0 ? 'bg-red-50' : 'bg-white'
											} hover:bg-red-100`}
										>
											<td className='border border-gray-300 px-4 py-2'>
												{passenger.passenger || 'N/A'}
											</td>
											<td className='border border-gray-300 px-4 py-2'>
												{passenger.description || 'N/A'}
											</td>
											<td className='border border-gray-300 px-4 py-2'>
												{passenger.address || 'N/A'}
											</td>
											<td className='border border-gray-300 px-4 py-2'>
												{passenger.postcode || 'N/A'}
											</td>
											<td className='border border-gray-300 px-4 py-2'>
												{passenger.phone || 'N/A'}
											</td>
											<td className='border border-gray-300 px-4 py-2 flex gap-2'>
												<button
													onClick={() => handleDelete(passenger.id)}
													className='px-3 py-1 text-red-500 rounded-md hover:bg-red-700 hover:text-white'
												>
													<MdDeleteForever />
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>

							{/* Mobile View */}
							<div className='md:hidden flex flex-col gap-4'>
								{currentPassengers.map((passenger, index) => (
									<div
										key={index}
										className='bg-white border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300'
									>
										<div className='flex justify-between items-center mb-2'>
											<h3 className='text-lg font-semibold text-red-700'>
												{passenger.passenger || 'N/A'}
											</h3>
											<button
												onClick={() => handleDelete(passenger.id)}
												className='px-3 py-1 text-red-500 rounded-full hover:bg-red-700 hover:text-white transition'
											>
												<MdDeleteForever />
											</button>
										</div>
										<p className='text-gray-600'>
											<span className='font-semibold'>Description: </span>
											{passenger.description || 'N/A'}
										</p>
										<p className='text-gray-600'>
											<span className='font-semibold'>Address: </span>
											{passenger.address || 'N/A'}
										</p>
										<p className='text-gray-600'>
											<span className='font-semibold'>Postcode: </span>
											{passenger.postcode || 'N/A'}
										</p>
										<p className='text-gray-600'>
											<span className='font-semibold'>Phone: </span>
											{passenger.phone || 'N/A'}
										</p>
									</div>
								))}
							</div>
						</div>

						{/* Pagination Controls */}
						<div className='flex flex-col md:flex-row justify-between items-center mt-4 gap-2'>
							{/* Rows Per Page */}
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
									<option value={5}>5</option>
									<option value={10}>10</option>
									<option value={20}>20</option>
								</select>
							</div>

							{/* Pagination */}
							<div className='flex items-center gap-2'>
								<button
									disabled={currentPage === 1}
									onClick={() => setCurrentPage((prev) => prev - 1)}
									className={`px-3 py-1 text-sm md:text-base text-white bg-[#b91c1c] rounded-md hover:bg-red-700 transition ${
										currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
									}`}
								>
									Prev
								</button>
								<p className='text-sm md:text-base'>
									{startIndex + 1}-
									{Math.min(
										startIndex + rowsPerPage,
										filteredPassengers.length
									)}{' '}
									of {filteredPassengers.length}
								</p>
								<button
									disabled={currentPage === totalPages}
									onClick={() => setCurrentPage((prev) => prev + 1)}
									className={`px-3 py-1 text-sm md:text-base text-white bg-[#b91c1c] rounded-md hover:bg-red-700 transition ${
										currentPage === totalPages
											? 'opacity-50 cursor-not-allowed'
											: ''
									}`}
								>
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

export default ExistingPassenger;
