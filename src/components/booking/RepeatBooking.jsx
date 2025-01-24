/** @format */

import { useState } from "react";
import { RRule } from "rrule";

const RepeatBooking = ({ isOpen, onClose, onConfirm }) => {
  const [frequency, setFrequency] = useState("None");
  const [repeatEnd, setRepeatEnd] = useState("Never");
  const [endDate, setEndDate] = useState("");
  const [selectedDays, setSelectedDays] = useState({
    sun: false,
    mon: false,
    tue: false,
    wed: false,
    thu: false,
    fri: false,
    sat: false,
  });
  const [error, setError] = useState("");

  const dayLabels = [
    { key: "sun", label: "S" },
    { key: "mon", label: "M" },
    { key: "tue", label: "T" },
    { key: "wed", label: "W" },
    { key: "thu", label: "T" },
    { key: "fri", label: "F" },
    { key: "sat", label: "S" },
  ];

  const handleDayClick = (day) => {
    if (frequency !== "Weekly") return; // Prevent interaction if not weekly
    setSelectedDays((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  const validateForm = () => {
    if (frequency === "Weekly" && !Object.values(selectedDays).some(Boolean)) {
      setError("Please select at least one day for weekly recurrence.");
      return false;
    }
    if (repeatEnd === "On Date" && new Date(endDate) < new Date()) {
      setError("End date cannot be in the past.");
      return false;
    }
    setError("");
    return true;
  };

  // Function to generate RRULE string
  const generateRecurrenceRule = () => {
    const daysOfWeekMap = {
      sun: RRule.SU,
      mon: RRule.MO,
      tue: RRule.TU,
      wed: RRule.WE,
      thu: RRule.TH,
      fri: RRule.FR,
      sat: RRule.SA,
    };

    const selectedDaysOfWeek = Object.keys(selectedDays)
      .filter((day) => selectedDays[day])
      .map((day) => daysOfWeekMap[day]);

    // Create RRule options based on the form input
    const ruleOptions = {
      freq:
        frequency === "Daily"
          ? RRule.DAILY
          : frequency === "Weekly"
          ? RRule.WEEKLY
          : null,
      byweekday: selectedDaysOfWeek.length > 0 ? selectedDaysOfWeek : undefined,
      until: repeatEnd === "On Date" ? new Date(endDate) : undefined,
    };

    if (!ruleOptions.freq) {
      return "";
    }

    // Generate the RRULE string
    const rule = new RRule(ruleOptions);
    return rule.toString();
  };

  const handleConfirm = () => {
    if (!validateForm()) return;

    // Generate RRULE string
    const recurrenceRule = generateRecurrenceRule();

    console.log("Generated Recurrence Rule:", recurrenceRule); // Log RRULE string to the console

    // Pass the recurrence rule and other data to the parent
    onConfirm({
      frequency,
      repeatEnd,
      endDate,
      selectedDays,
      recurrenceRule,
    });

    onClose(); // Close the modal after confirming
  };

  if (!isOpen) return null; // Do not render if modal is not open

  return (
    <div
      className="fixed pt-10 inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      role="dialog"
      aria-labelledby="repeat-booking-title"
    >
      <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
        <h2
          id="repeat-booking-title"
          className="text-lg font-bold mb-4 text-gray-900"
        >
          Repeat Booking
        </h2>

        {/* Frequency Field */}
        <div className="mb-4">
          <label
            htmlFor="frequency"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Frequency
          </label>
          <select
            id="frequency"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="bg-white w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          >
            <option value="None">None</option>
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
          </select>
        </div>

        {/* Days of the Week Field (for Weekly Frequency) */}
        {frequency === "Weekly" && (
          <div className="mb-4">
            <label
              htmlFor="days"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Days
            </label>
            <div
              id="days"
              className="flex space-x-2 justify-center"
              aria-live="polite"
            >
              {dayLabels.map(({ key, label }) => (
                <div
                  key={key}
                  onClick={() => handleDayClick(key)}
                  className={`w-10 h-10 rounded-full text-white flex items-center justify-center cursor-pointer select-none ${
                    selectedDays[key] ? "bg-red-600" : "bg-gray-300"
                  }`}
                  role="button"
                  aria-pressed={selectedDays[key]}
                  aria-label={`Select ${label}`}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Repeat End Field */}
        <div className="mb-4">
          <label
            htmlFor="repeat-end"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Repeat End
          </label>
          <select
            id="repeat-end"
            value={repeatEnd}
            onChange={(e) => setRepeatEnd(e.target.value)}
            className="bg-white w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          >
            <option value="Never">Never</option>
            <option value="On Date">Until</option>
          </select>
        </div>

        {/* Repeat End Date Field */}
        {repeatEnd === "On Date" && (
          <div className="mb-4">
            <label
              htmlFor="end-date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Repeat End Date
            </label>
            <input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-white w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            />
          </div>
        )}

        {/* Error Message */}
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-md text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md text-sm"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default RepeatBooking;
