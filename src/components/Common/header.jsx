/** @format */
import carlogo from "../../assets/acelogo.png"; // Replace with the correct path to your logo image

const Header = () => {
  return (
    <header className="bg-white p-4 flex flex-col sm:flex-row items-center justify-between">
      {/* Left Section: Logo */}
      <div className="flex items-center space-x-3">
        <img
          src={carlogo}
          alt="Logo"
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-md object-contain" // Logo styling
        />
      </div>

      {/* Center Section: Title */}
      <div className="flex-grow text-center">
        <h1 className="text-lg sm:text-2xl font-extrabold text-blue-700">
          ACE TAXIS - ACCOUNT WEB BOOKING
        </h1>
      </div>

      {/* Right Section: Account Info */}
      <div className="text-center sm:text-right text-xs sm:text-base text-gray-700 mt-3 sm:mt-0">
        <p className="font-medium">9015 - Harbour Vale Acc</p>
        <p className="text-gray-500">
          Logged in as: <span className="font-semibold">Peter Farrell</span>
        </p>
      </div>
    </header>
  );
};

export default Header;
