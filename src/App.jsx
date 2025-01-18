/** @format */

import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './utils/Protected'; // Import the ProtectedRoute component
import CreateBookingForm from './components/booking/CreateBookingForm';
import Confirmation from './components/booking/Confirmation';
import Login from './components/Authentication/Login';
import AddPassenger from './components/booking/AddPassenger';
import BookingDashboard from './components/booking/BookingDashboard';
import PassengerList from './components/booking/PassengerList';
import ExistingPassenger from './components/booking/ExistingPassenger';

function App() {
  return (
    <div className="h-screen w-screen overflow-hidden bg-[#F3F4F6]">
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <BookingDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/AddPassenger"
          element={
            <ProtectedRoute>
              <AddPassenger />
            </ProtectedRoute>
          }
        />

        <Route
          path="/existingpassengers"
          element={
            <ProtectedRoute>
              <ExistingPassenger />
            </ProtectedRoute>
          }
        />

        <Route
          path="/passengerlist"
          element={
            <ProtectedRoute>
              <PassengerList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/createbookingform"
          element={
            <ProtectedRoute>
              <CreateBookingForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/confirmation"
          element={
            <ProtectedRoute>
              <Confirmation />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
