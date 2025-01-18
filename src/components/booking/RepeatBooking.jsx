/** @format */

import { useState } from 'react';

const RepeatBooking = ({ isOpen, onClose, onConfirm }) => {
	const [frequency, setFrequency] = useState('None');
	const [repeatEnd, setRepeatEnd] = useState('Never');
	const [endDate, setEndDate] = useState('');
	const [selectedDays, setSelectedDays] = useState({
		sun: false,
		mon: false,
		tue: false,
		wed: false,
		thu: false,
		fri: false,
		sat: false,
	});

	const dayLabels = [
		{ key: 'sun', label: 'S' },
		{ key: 'mon', label: 'M' },
		{ key: 'tue', label: 'T' },
		{ key: 'wed', label: 'W' },
		{ key: 'thu', label: 'T' },
		{ key: 'fri', label: 'F' },
		{ key: 'sat', label: 'S' },
	];

	const handleDayClick = (day) => {
		setSelectedDays((prev) => ({
			...prev,
			[day]: !prev[day],
		}));
	};

	if (!isOpen) return null; // Do not render if modal is not open

	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
			<div className='bg-white rounded-lg p-6 shadow-lg w-full max-w-md'>
				<h2 className=' text-lg font-bold mb-4'>Repeat Booking</h2>

				{/* Frequency Field */}
				<div className='mb-4'>
					<label className=' bg-white block text-sm font-medium text-gray-700 mb-1'>
						Frequency
					</label>
					<select
						value={frequency}
						onChange={(e) => setFrequency(e.target.value)}
						className='bg-white w-full p-2 border border-gray-300 rounded-md'
					>
						<option value='None'>None</option>
						<option value='Daily'>Daily</option>
						<option value='Weekly'>Weekly</option>
					</select>
				</div>

				{/* Days of the Week Field (for Weekly Frequency) */}
				{frequency === 'Weekly' && (
					<div className='mb-4'>
						<label className='block text-sm font-medium text-gray-700 mb-1'>
							Days
						</label>
						<div className='flex space-x-2 justify-center'>
							{dayLabels.map(({ key, label }) => (
								<div
									key={key}
									onClick={() => handleDayClick(key)}
									className={`w-10 h-10 rounded-full text-white flex items-center justify-center cursor-pointer select-none ${
										selectedDays[key] ? 'bg-red-600' : 'bg-gray-300'
									}`}
								>
									{label}
								</div>
							))}
						</div>
					</div>
				)}

				{/* Repeat End Field */}
				<div className='mb-4'>
					<label className='block text-sm font-medium text-gray-700 mb-1'>
						Repeat End
					</label>
					<select
						value={repeatEnd}
						onChange={(e) => setRepeatEnd(e.target.value)}
						className='bg-white w-full p-2 border border-gray-300 rounded-md'
					>
						<option value='Never'>Never</option>
						<option value='On Date'>Until</option>
					</select>
				</div>

				{/* Repeat End Date Field */}
				
					<div className='mb-4'>
						<label className='bg-white block text-sm font-medium text-gray-700 mb-1'>
							Repeat End Date
						</label>
						<input
						disabled={repeatEnd === 'never'}
						required
						type='date'
						value={endDate}
						onChange={(e) => setEndDate(e.target.value)}
						id='end-date'
						className='border border-border rounded-md p-2 w-full bg-input text-foreground focus:ring-primary focus:border-primary'
					/>
					</div>
				

				{/* Buttons */}
				<div className='flex justify-end gap-2'>
					<button
						onClick={onClose}
						className='px-4 py-2 bg-gray-300 rounded-md text-sm'
					>
						Cancel
					</button>
					<button
						onClick={() =>
							onConfirm({
								frequency,
								repeatEnd,
								endDate,
								selectedDays,
							})
						}
						className='px-4 py-2 bg-red-600 text-white rounded-md text-sm'
					>
						Confirm
					</button>
				</div>
			</div>
		</div>
	);
};

export default RepeatBooking;
