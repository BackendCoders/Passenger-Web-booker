/** @format */

import { useNavigate } from 'react-router-dom';
import Header from '../Common/header'; // ✅ Keeping the same Header
import { TiArrowBack } from 'react-icons/ti';

const HistoryBooking = () => {
	const navigate = useNavigate();

	return (
		<div>
			<Header />
			<div className='bg-white pt-10 p-4 flex flex-col items-center min-h-[500px] sm:min-h-screen sm:max-h-full'>
				{/* ✅ Back Button */}
				<button
					onClick={() => navigate('/')}
					className='flex-shrink-0 px-3 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition flex items-center justify-center mb-4'
				>
					<TiArrowBack className='mr-2' />
					<span className='font-medium'>Back</span>
				</button>

				{/* ✅ Content After Table Removal */}
				<div className='text-center text-lg font-semibold text-gray-700'>
					<p>No data available in booking history.</p>
				</div>
			</div>
		</div>
	);
};

export default HistoryBooking;
