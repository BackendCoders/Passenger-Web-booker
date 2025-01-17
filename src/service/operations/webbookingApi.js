import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const webbookingApi = {
  createWebBooking: async (formData) => {
    const response = await axios.post(`${BASE_URL}/WeBooking/CreateWebBooking`, formData);
    return response.data;
  },
};

export default webbookingApi;
