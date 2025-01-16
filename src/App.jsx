/** @format */

import { Route, Routes } from 'react-router-dom';
import CreateBookingForm from './components/booking/CreateBookingForm';
import BookingDetails from './components/booking/BookingDetails';
import Confirmation from './components/booking/Confirmation';
import Login from './components/Authentication/Login';
import AddPassenger from './components/booking/AddPassenger';
import BookingDashboard from './components/booking/BookingDashboard';
import PassengerList from './components/booking/PassengerList';
import ExistingPassenger from './components/booking/ExistingPassenger';
// import { useEffect } from 'react';

function App() {
	return (
		<div className='h-screen w-screen overflow-hidden bg-[#F3F4F6]'>
			<Routes>
				{/* Login Route */}
				<Route
					path='/'
					element={<Login />}
				/>
				<Route
					path='/dashboard'
					element={<BookingDashboard />}
				/>

				<Route
					path='/AddPassenger'
					element={<AddPassenger />}
				/>

				<Route
					path='/existingpassengers'
					element={<ExistingPassenger />}
				/>

				<Route
					path='/passengerlist'
					element={<PassengerList />}
				/>

				{/* Booking Steps (Protected) */}

				<Route
					path='/createbookingform'
					element={<CreateBookingForm />}
				/>
				<Route
					path='/booking-details'
					element={<BookingDetails />}
				/>
				<Route
					path='/confirmation'
					element={<Confirmation />}
				/>
			</Routes>
		</div>
	);
}

export default App;
