import axios from "axios";
import { API_URL } from "./constants"

export const postMessage = async (userId, message) => {
  const response = await axios.post(`${API_URL}/chat`, {
    userId,
    message,
  });
  return response.data
};
