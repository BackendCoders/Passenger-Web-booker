/** @format */
import { useNavigate } from "react-router-dom";
import Header from "../Common/header";

const BookingDashboard = () => {
    const navigate = useNavigate();

    const handleCreateBooking = () => {
        navigate("/createbookingform"); // Replace with the correct route for creating a booking
    };

    const handleAddPassenger = () => {
        navigate("/AddPassenger"); // Replace with the correct route for adding a new passenger
    };

    const handleExistingPassengers = () => {
        navigate("/existingPassengers"); // Replace with the correct route for viewing existing passengers
    };

    return (
        <div>
            {/* Header Section */}
            <Header />
            <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
                {/* Buttons Section */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl">
                    <button
                        onClick={handleCreateBooking}
                        className="bg-blue-700 text-white rounded-lg shadow-lg py-8 sm:py-16 px-4 sm:px-6 text-center font-semibold text-base sm:text-2xl hover:bg-blue-800 transition duration-300"
                    >
                        CREATE NEW BOOKING
                    </button>
                    <button
                        onClick={handleAddPassenger}
                        className="bg-blue-700 text-white rounded-lg shadow-lg py-8 sm:py-16 px-4 sm:px-6 text-center font-semibold text-base sm:text-2xl hover:bg-blue-800 transition duration-300"
                    >
                        ADD NEW PASSENGER
                    </button>
                    <button
                        onClick={handleExistingPassengers}
                        className="bg-blue-700 text-white rounded-lg shadow-lg py-8 sm:py-16 px-4 sm:px-6 text-center font-semibold text-base sm:text-2xl hover:bg-blue-800 transition duration-300"
                    >
                        EXISTING PASSENGERS
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingDashboard;
