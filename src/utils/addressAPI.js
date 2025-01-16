import axios from "axios";
// import { sendLogs } from "./getLogs"; // Ensure this exists or replace with your logger

const BASE = import.meta.env.VITE_BASE_URL; // API base URL
const API_KEY = import.meta.env.VITE_GETADDRESS_KEY; // Address API key

// Helper to set headers
function setHeaders() {
  const accessToken = localStorage.getItem("authToken");
  return accessToken
    ? {
        accept: "*/*",
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      }
    : {};
}

// Fetch postcode suggestions
export async function getPostal(code) {
  const URL = `https://api.getaddress.io/v2/uk/${code}?api-key=${API_KEY}`;
  return await handleGetReq(URL);
}

// Fetch full address details
export async function getAddressDetails(id) {
  const URL = `https://api.getAddress.io/get/${id}?api-key=${API_KEY}`;
  try {
    const response = await axios.get(URL);
    const data = response.data;

    const cleanedAddress = data.formatted_address
      .filter((line) => line && line.trim())
      .join(", ");

    return {
      address: cleanedAddress,
      postcode: data.postcode || "No Postcode",
      latitude: data.latitude,
      longitude: data.longitude,
    };
  } catch (error) {
    console.error("Error fetching full address details:", error);
    return null;
  }
}

// Fetch address suggestions
export async function getAddressSuggestions(location) {
  const URL = `https://api.getAddress.io/autocomplete/${location}?api-key=${API_KEY}`;
  try {
    const autocompleteResponse = await axios.post(URL, {
      location: { latitude: 51.0388, longitude: -2.2799 },
    });

    const suggestions = autocompleteResponse.data.suggestions;

    return suggestions.map((suggestion) => ({
      label: suggestion.address,
      id: suggestion.id,
      address: suggestion.address || "Unknown Address",
    }));
  } catch (error) {
    console.error("Error fetching address suggestions:", error);
    return [];
  }
}

// Generic GET request handler
async function handleGetReq(URL) {
  try {
    const response = await axios.get(URL, { headers: setHeaders() });
    if (response.status >= 200 && response.status < 300) {
      return { ...response.data, status: "success" };
    } else {
      console.log("Unexpected response status:", response);
      return null;
    }
  } catch (err) {
    sendLogs({ url: URL, error: err.response }, "error");
    console.error("Error in GET request:", err);
    return {
      ...err.response,
      status: err.response?.status > 499 ? "error" : "fail",
      message: `${
        err.response?.status > 499 ? "server error" : "Failed"
      } while fetching the data`,
    };
  }
}
