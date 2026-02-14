import axios from "axios";

const API_URL = "http://localhost:5000/api/admin";

const getHeaders = () => {
  const token = localStorage.getItem("token"); // Assuming token is stored here
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const adminService = {
  getAllUsers: async () => {
    const response = await axios.get(`${API_URL}/users`, getHeaders());
    return response.data;
  },

  getUserDetails: async (id: string) => {
    const response = await axios.get(`${API_URL}/users/${id}`, getHeaders());
    return response.data;
  },
};
