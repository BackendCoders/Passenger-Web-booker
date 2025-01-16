/** @format */

import { useNavigate } from "react-router-dom";
import Header from "../Common/header";

const AddPassenger = () => {
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to handle form submission (e.g., save data)
    console.log("Passenger created!");

    // Redirect to Passenger List
    navigate("/passengerlist");
  };

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-50 p-4">
        {/* Button Section */}
        <div className="flex justify-center gap-4 mb-8">
          {/* Back Button */}
          <button
            onClick={() => navigate("/dashboard")} // Go back to the previous page
            className="px-5 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
          >
            Back
          </button>

          {/* Add Passenger Button */}
          <button
            onClick={() => navigate("/add-passenger")} // Stay on the Add Passenger page
            className="px-5 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
          >
            Add Passenger
          </button>

          {/* Passenger List Button */}
          <button
            onClick={() => navigate("/passengerlist")} // Navigate to Passenger List route
            className="px-5 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
          >
            Passenger List
          </button>
        </div>

        {/* Add Passenger Form */}
        <div className="flex justify-center">
          <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg overflow-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Passenger Name */}
              <div>
                <label
                  htmlFor="passengerName"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Passenger Name:
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  id="passengerName"
                  placeholder="Enter passenger name"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Description:
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  id="description"
                  placeholder="Enter description"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                  required
                />
              </div>

              {/* Address and Postcode (Side-by-Side) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="address"
                    className="block text-gray-700 font-medium mb-1"
                  >
                    Address:
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    id="address"
                    placeholder="Enter address"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="postcode"
                    className="block text-gray-700 font-medium mb-1"
                  >
                    Postcode:
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    id="postcode"
                    placeholder="Enter postcode"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Phone and Email (Side-by-Side) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-gray-700 font-medium mb-1"
                  >
                    Phone #:
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    placeholder="Enter phone number"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-gray-700 font-medium mb-1"
                  >
                    Email:
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter email address"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate("/passenger-list")} // Redirect on cancel
                  className="px-5 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
                >
                  Create Passenger
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPassenger;
