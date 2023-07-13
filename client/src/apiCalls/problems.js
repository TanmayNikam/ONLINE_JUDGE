import axios from "axios";

export const getAllProblems = async () => {
  try {
    const response = await axios.get("api/problems");
    return response.data;
  } catch (error) {
    if ("response" in error && "data" in error.response)
      return error.response.data;
    return error;
  }
};
