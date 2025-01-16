/** @format */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Common/header";
import toast from "react-hot-toast"; // Notification library

const AddPassenger = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    passengerName: "",
    description: "",
    address: "",
    postcode: "",
    phone: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.passengerName ||
      !formData.description ||
      !formData.address ||
      !formData.postcode
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Prepare the payload
    const requestBody = {
      id: 0, // Static value for new passengers
      accNo: 9999, // Static account number
      description: formData.description,
      passenger: formData.passengerName, // Map passengerName to passenger
      address: formData.address,
      postcode: formData.postcode,
      phone: formData.phone || "", // Optional field
      email: formData.email || "", // Optional field
    };

    console.log("Sending Request Body:", requestBody);

    try {
      setLoading(true);

      const response = await fetch(
        "https://dev.ace-api.1soft.co.uk/api/WeBooking/AddNewPassenger",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer your-auth-token-here`, // Replace with actual token
          },
          body: JSON.stringify(requestBody),
        }
      );

      const result = await response.json();
      console.log("API Response:", result);

      if (!response.ok) {
        throw new Error(result.message || "Failed to create passenger");
      }

      toast.success("Passenger created successfully!");
      navigate("/passengerlist");
    } catch (error) {
      console.error("Error creating passenger:", error);
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 p-4">
        {/* Button Section */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="px-5 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
          >
            Back
          </button>
          <button
            onClick={() => navigate("/add-passenger")}
            className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Add Passenger
          </button>
          <button
            onClick={() => navigate("/passengerlist")}
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
                  value={formData.passengerName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-red-500"
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
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-red-500"
                  required
                />
              </div>

              {/* Address and Postcode */}
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
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-red-500"
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
                    value={formData.postcode}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-red-500"
                    required
                  />
                </div>
              </div>

              {/* Phone and Email */}
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
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-red-500"
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
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-red-500"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate("/passengerlist")}
                  className="px-5 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  disabled={loading} // Disable button while loading
                >
                  {loading ? "Submitting..." : "Create Passenger"}
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
