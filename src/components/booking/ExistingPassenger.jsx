/** @format */

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchPassengers, removePassenger } from "../../slices/formSlice";
import Header from "../Common/header";
import { MdDeleteForever } from "react-icons/md";

const ExistingPassenger = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { passengers, loading, error } = useSelector((state) => state.forms);
  console.log(passengers)
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Default rows per page


  // Fetch passengers when the component mounts
  useEffect(() => {
    dispatch(fetchPassengers());
  }, [dispatch]);

  // Delete passenger
  const handleDelete = (id) => {
    const token = "static-token"; // Use actual token here
    dispatch(removePassenger({ token, id }));
  };

  // Filter passengers by search term
  const filteredPassengers = passengers.filter(
    (passenger) =>
      passenger.passenger.toLowerCase().includes(searchTerm.toLowerCase()) ||
      passenger.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      passenger.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      passenger.postcode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredPassengers.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentPassengers = filteredPassengers.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  // Reset to the first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, rowsPerPage]);


  return (
    <div>
    <Header />
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 p-4 flex flex-col items-center">
      {/* Button Section */}
      <div className="flex justify-between items-center gap-4 mb-4">
        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
        >
          Back
        </button>

        {/* Right Section: Buttons and Search */}
        <div className="flex items-center gap-4 w-full max-w-3xl">
          <button
            onClick={() => navigate("/AddPassenger")}
            className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Add Passenger
          </button>

          <button
            onClick={() => navigate("/passengerlist")}
            className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Passenger List
          </button>

          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search passengers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring focus:ring-red-500"
          />
        </div>
      </div>




      {/* Error Message */}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {/* Loading Spinner */}
      {loading && <p className="text-center mb-4">Loading...</p>}

      {!loading && filteredPassengers.length > 0 && (
        <div className="w-full max-w-7xl bg-white p-8 rounded-lg shadow-lg">
          <div className="overflow-auto max-h-[70vh]">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-red-600 text-white sticky top-0 z-10">
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Acc. Num
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
                {currentPassengers.map((passenger, index) => (
                  <tr
                    key={index}
                    className={`${index % 2 === 0 ? "bg-red-50" : "bg-white"
                      } hover:bg-red-100`}
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
                          onClick={() => handleDelete(passenger.id)}
                          className="px-3 py-1 text-red-500 rounded-md hover:bg-red-700 hover:text-white"
                        >
                          <MdDeleteForever />
                        </button>
                      </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            {/* Rows Per Page */}
            <div>
              <label htmlFor="rowsPerPage" className="mr-2 text-black font-semibold">
                Rows per page:
              </label>
              <select
                id="rowsPerPage"
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(Number(e.target.value))}
                className="px-2 py-1 border border-red-600 bg-white text-black rounded-md hover:bg-red-50 focus:outline-none focus:ring focus:ring-red-500"
              >
                <option value={5} className="bg-white text-black">5</option>
                <option value={10} className="bg-white text-black">10</option>
                <option value={20} className="bg-white text-black">20</option>
              </select>
            </div>


            {/* Pagination */}
            <div className="flex items-center">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className={`px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
              >
                Previous
              </button>
              <p className="mx-4">
                {startIndex + 1}-
                {Math.min(startIndex + rowsPerPage, filteredPassengers.length)}{" "}
                of {filteredPassengers.length}
              </p>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className={`px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
                  }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
  );
};

export default ExistingPassenger;
