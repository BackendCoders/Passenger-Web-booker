import { useNavigate } from "react-router-dom";
import Header from "../Common/header";
import { RiLogoutBoxLine } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { logout } from "../../service/operations/authApi";
import { MdDashboard } from "react-icons/md"; // Dashboard Icon

function Confirmation() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleNewBooking = () => {
    navigate("/createbookingform"); // Navigate to Create Booking Form
  };

  const handleDashboard = () => {
    navigate("/"); // Navigate to Dashboard
  };

  return (
    <div className="bg-white min-h-screen">
      {/* ✅ Header remains unchanged */}
      <Header />

      {/* ✅ Main Content Centered */}
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-6">
        
        {/* ✅ Success Message */}
        <div className="w-full max-w-2xl bg-green-500 text-white text-2xl font-bold text-center py-5 rounded-lg shadow-md">
          🎉 Booking Request Created
        </div>

        {/* ✅ Confirmation Text */}
        <div className="w-full max-w-2xl mt-8 bg-white rounded-lg p-8  text-center">
          <p className="text-gray-700 text-lg leading-relaxed">
            Your booking request has been successfully created. An operator will review your booking shortly, and you will receive an email confirmation.
          </p>
          <p className="mt-4 text-red-600 font-semibold">
            Please note: This booking is not confirmed until you receive a booking confirmation email.
          </p>
        </div>

        {/* ✅ Action Buttons */}
        <div className="flex flex-wrap justify-center gap-6 mt-10 w-full max-w-2xl">
          
          {/* 🏠 Dashboard Button */}
          <button
            onClick={handleDashboard}
            className="px-8 py-3 bg-gray-800 text-white font-medium text-lg rounded-lg hover:bg-gray-900 transition duration-300 shadow-md flex items-center justify-center gap-2"
          >
            <MdDashboard className="text-2xl" />
            Go to Dashboard
          </button>

          {/* ➕ New Booking Button */}
          <button
            onClick={handleNewBooking}
            className="px-8 py-3 bg-blue-600 text-white font-medium text-lg rounded-lg hover:bg-blue-700 transition duration-300 shadow-md"
          >
            New Booking Request +
          </button>

          {/* 🔴 Log Out Button */}
          <button
            onClick={() => dispatch(logout(navigate))}
            className="px-8 py-3 bg-red-600 text-white font-medium text-lg rounded-lg hover:bg-red-700 transition duration-300 shadow-md flex items-center justify-center gap-2"
          >
            <RiLogoutBoxLine className="text-2xl" />
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default Confirmation;
