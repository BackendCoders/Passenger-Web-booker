
import { useNavigate } from 'react-router-dom';
import Header from '../Common/header';
import { RiLogoutBoxLine } from "react-icons/ri";

function Confirmation() {
  const navigate = useNavigate();

  const handleNewBooking = () => {
    navigate('/createbookingform'); // Adjust this route as needed
  };

  const handleLogOut = () => {
    navigate('/login'); // Adjust this route as needed
  };

  return (
    <div>
      <Header />
      <div className="flex flex-col pt-20 items-center  min-h-screen bg-white px-4">
        {/* Success Banner */}
        <div className="w-full max-w-lg bg-green-500 text-white text-xl font-bold text-center py-4 rounded-lg shadow-md">
          <p>🎉 Booking Request Created</p>
        </div>

        {/* Confirmation Message */}
        <div className="w-full max-w-lg mt-8 bg-white rounded-lg p-6">
          <p className="text-gray-700 text-center text-lg leading-relaxed">
            Your booking request has been successfully created. An operator will review your booking shortly, and you will receive an email confirmation.
          </p>
          <p className="mt-4 text-red-600 font-semibold text-center">
            Please note: This booking is not confirmed until you receive a booking confirmation email.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-10 w-full max-w-md">
          {/* Log Out Button */}
          <button
            onClick={handleLogOut}
            className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white font-medium text-lg rounded-lg hover:bg-red-700 transition duration-300 shadow-md flex items-center justify-center gap-2"
          >
            <RiLogoutBoxLine className="text-2xl" />
            Log Out
          </button>
          <button
            onClick={handleNewBooking}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-medium text-lg rounded-lg hover:bg-blue-700 transition duration-300 shadow-md"
          >
            New Booking Request +
          </button>
        </div>
      </div>
    </div>
  );
}

export default Confirmation;
