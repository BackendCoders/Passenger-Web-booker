/** @format */
import { useNavigate } from "react-router-dom";
import Header from "../Common/header";
import addpassenger from '../../assets/addpassenger.svg';
import existingpassenger from '../../assets/existingpassenger.svg';
import newbooking from '../../assets/newbooking.svg';

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
            <div className="min-h-screen bg-white flex flex-col justify-center items-center p-4">
                {/* Buttons Section */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl">
                    {/* Create New Booking Button */}
                    <button
                        onClick={handleCreateBooking}
                        className="group bg-blue-700 text-white rounded-lg shadow-lg py-8 px-4 sm:px-6 text-center hover:bg-blue-800 transition duration-300 flex flex-col items-center"
                    >
                        <img
                            src={newbooking}
                            alt="New Booking"
                            className="w-16 h-16 sm:w-24 sm:h-24 mb-4 group-hover:scale-110 group-hover:filter  transition-transform duration-300"
                        />
                        <span className="font-semibold text-sm sm:text-lg">CREATE NEW BOOKING</span>
                    </button>

                    {/* Add New Passenger Button */}
                    <button
                        onClick={handleAddPassenger}
                        className="group bg-blue-700 text-white rounded-lg shadow-lg py-8 px-4 sm:px-6 text-center hover:bg-blue-800 transition duration-300 flex flex-col items-center"
                    >
                        <img
                            src={addpassenger}
                            alt="Add Passenger"
                            className="w-16 h-16 sm:w-24 sm:h-24 mb-4 group-hover:scale-110 group-hover:filter  transition-transform duration-300"
                        />
                        <span className="font-semibold text-sm sm:text-lg">ADD NEW PASSENGER</span>
                    </button>

                    {/* Existing Passengers Button */}
                    <button
                        onClick={handleExistingPassengers}
                        className="group bg-blue-700 text-white rounded-lg shadow-lg py-8 px-4 sm:px-6 text-center hover:bg-blue-800 transition duration-300 flex flex-col items-center"
                    >
                        <img
                            src={existingpassenger}
                            alt="Existing Passengers"
                            className="w-16 h-16 sm:w-24 sm:h-24 mb-4 group-hover:scale-110 group-hover:filter transition-transform duration-300"
                        />
                        <span className="font-semibold text-sm sm:text-lg">EXISTING PASSENGERS</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingDashboard;
