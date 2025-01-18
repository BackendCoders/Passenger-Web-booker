/** @format */

import { Route, Routes } from 'react-router-dom';
import CreateBookingForm from './components/booking/CreateBookingForm';
import Confirmation from './components/booking/Confirmation';
import Login from './components/Authentication/Login';
import AddPassenger from './components/booking/AddPassenger';
import BookingDashboard from './components/booking/BookingDashboard';
import PassengerList from './components/booking/PassengerList';
import ExistingPassenger from './components/booking/ExistingPassenger';
import Privateroute from './components/Common/PrivateRoute';

function App() {
	return (
		<div className="h-screen w-screen overflow-hidden bg-[#F3F4F6]">
			<Routes>
				{/* Public Routes */}
				<Route path="/" element={<Login />} />
				

				{/* Protected Routes */}
				<Route element={<Privateroute />}>
					<Route path="/dashboard" element={<BookingDashboard />} />
					<Route path="/createbookingform" element={<CreateBookingForm />} />
					<Route path="/confirmation" element={<Confirmation />} />
          <Route path="/AddPassenger" element={<AddPassenger />} />
				<Route path="/existingpassengers" element={<ExistingPassenger />} />
				<Route path="/passengerlist" element={<PassengerList />} />
				</Route>
			</Routes>
		</div>
	);
}

export default App;
