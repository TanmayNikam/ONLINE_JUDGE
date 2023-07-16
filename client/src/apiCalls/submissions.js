import axios from "axios";

export const addSubmission = async (language, code, problemId, userToken) => {
  try {
    const response = await axios.post(
      `/api/submissions/${problemId}`,
      { code, language },
      { headers: { Authorization: `Bearer ${userToken}` } }
    );
    return response.data;
  } catch (error) {
    if ("response" in error && "data" in error.response)
      return error.response.data;
    return error;
  }
};

export const getSubmissions = async (type, token = "", problemId) => {
  try {
    let response;
    if (type === "All")
      response = await axios.get(`/api/submissions/${problemId}`);
    else
      response = await axios.get(`/api/submissions/user/${problemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    return response.data;
  } catch (error) {
    console.log(error);
    if ("response" in error && "data" in error.response)
      return error.response.data;
    return error;
  }
};

export const getSubmissionCode = async (submissionId) => {
  try {
    const response = await axios.get(`/api/submissions/code/${submissionId}`);
    return response.data;
  } catch (error) {
    if ("response" in error && "data" in error.response)
      return error.response.data;
    return error;
  }
};
