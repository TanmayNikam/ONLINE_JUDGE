import axios from "axios";
export const register = async (user) => {
  try {
    const response = await axios.post("api/users/signup", user);
    return response.data;
  } catch (error) {
    if ("response" in error && "data" in error.response)
      return error.response.data;
    return error;
  }
};


export const login = async(user)=>{
    try {
      const response = await axios.post("api/users/login", user);
      return response.data;
    } catch (error) {
      if ("response" in error && "data" in error.response)
        return error.response.data;
      return error;
    }
}