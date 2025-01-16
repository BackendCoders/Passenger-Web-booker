import  { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchPassengers, removePassenger } from "../../slices/formSlice";
import Header from "../Common/header";

const PassengerList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { passengers, loading, error } = useSelector((state) => state.forms);
  console.log( passengers)

  // Fetch passengers when the component mounts
  useEffect(() => {
    dispatch(fetchPassengers());
  }, [dispatch]);

  // Delete passenger
  const handleDelete = (id) => {
    const token = "static-token"; // Use actual token here
    dispatch(removePassenger({ token, id }));
  };

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-50 p-4">
        {/* Button Section */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="px-5 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
          >
            Back
          </button>

          <button
            onClick={() => navigate("/AddPassenger")}
            className="px-5 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
          >
            Add Passenger
          </button>

          <button
            onClick={() => navigate("/passengerlist")}
            className="px-5 py-2 bg-blue-700 text-white rounded-lg hover:bg-gray-400 transition"
          >
            Passenger List
          </button>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {/* Loading Spinner */}
        {loading && <p className="text-center">Loading...</p>}

        {/* Passenger List Table */}
        {!loading && passengers.length > 0 && (
          <div className="flex justify-center">
            <div className="w-full max-w-7xl bg-white p-8 rounded-lg shadow-lg overflow-auto">
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-blue-700 text-white">
                  <th className="border border-gray-300 px-4 py-2 text-left">
                      Account Num
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
                          onClick={() => handleDelete(passenger.id)}
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
        )}
      </div>
    </div>
  );
};

export default PassengerList;
