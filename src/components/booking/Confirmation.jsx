import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Common/header';

function Confirmation() {
  const navigate = useNavigate();

  const handleNewBooking = () => {
    navigate('/createbookingform'); // Adjust this route as needed
  };

  const handleLogOut = () => {
    navigate('/'); // Adjust this route as needed
  };

  return (
    <div>
      <Header />
      <div className="flex flex-col items-center min-h-screen p-6 bg-gray-100">
        {/* Success Banner */}
        <div className="w-full max-w-xl bg-green-500 text-white text-lg font-bold text-center py-4 rounded-md">
          BOOKING REQUEST CREATED
        </div>

        {/* Confirmation Message */}
        <div className="w-full max-w-xl mt-6 text-center">
          <p className="text-gray-700 text-base">
            AN OPERATOR WILL REVIEW YOUR BOOKING SHORTLY AND YOU WILL RECEIVE AN EMAIL CONFIRMATION.
          </p>
          <p className="mt-4 text-red-600 font-semibold">
            PLEASE NOTE THIS BOOKING IS NOT CONFIRMED UNTIL YOU RECEIVE A BOOKING CONFIRMATION.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex mt-8 space-x-4">
          <button
            onClick={handleLogOut}
            className="px-6 py-2 bg-blue-600 text-white font-medium text-base rounded-md hover:bg-blue-700 transition duration-300"
          >
            Log Out
          </button>
          <button
            onClick={handleNewBooking}
            className="px-6 py-2 bg-blue-600 text-white font-medium text-base rounded-md hover:bg-blue-700 transition duration-300"
          >
            New Booking Request
          </button>
        </div>
      </div>
    </div>
  );
}

export default Confirmation;
