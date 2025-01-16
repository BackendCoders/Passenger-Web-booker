/** @format */

import { useNavigate } from "react-router-dom";
import Header from "../Common/header";

const ExistingPassenger = () => {
   const navigate = useNavigate();
  
    // Sample JSON data
    const passengers = [
      {
        accNo: 9999,
        address: "123 The Road",
        description: "Peter Home",
        email: null,
        passenger: "Peter",
        phone: "12345",
        postcode: "SP8 4GH",
      },
      {
        accNo: 1001,
        address: "456 Another St",
        description: "John's Office",
        email: "john@example.com",
        passenger: "John",
        phone: "98765",
        postcode: "BN1 1AA",
      },
    ];

  return (
    <div>
    <Header />
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Button Section */}
      <div className="flex justify-center gap-4 mb-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")} // Navigate back
          className="px-5 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
        >
          Back
        </button>

        {/* Add Passenger Button */}
        <button
          onClick={() => navigate("/AddPassenger")} // Navigate to Add Passenger
          className="px-5 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
        >
          Add Passenger
        </button>

        {/* Passenger List Button */}
        <button
          onClick={() => navigate("/passengerlist")} // Navigate to Passenger List route
          className="px-5 py-2  bg-blue-700 text-white rounded-lg hover:bg-gray-400 transition"
        >
          Passenger List
        </button>
      </div>

      {/* Passenger List Table */}
      <div className="flex justify-center">
        <div className="w-full max-w-7xl bg-white p-8 rounded-lg shadow-lg overflow-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-700 text-white">
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Account No
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Passenger
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Description
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Address
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Postcode
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Phone
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Email
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {passengers.map((passenger, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100`}
                >
                  <td className="border border-gray-300 px-4 py-2">
                    {passenger.accNo}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {passenger.passenger}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {passenger.description}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {passenger.address}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {passenger.postcode}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {passenger.phone}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {passenger.email || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 flex gap-2">
                    <button
                      className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  );
};

export default ExistingPassenger;
