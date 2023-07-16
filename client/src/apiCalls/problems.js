import axios from "axios";

export const getAllProblems = async () => {
  try {
    const response = await axios.get("/api/problems");
    return response.data;
  } catch (error) {
    if ("response" in error && "data" in error.response)
      return error.response.data;
    return error;
  }
};

export const getProblemById = async (problemId) => {
  try {
    const response = await axios.get(`/api/problems/${problemId}`);
    return response.data;
  } catch (error) {
    if ("response" in error && "data" in error.response)
      return error.response.data;
    return error;
  }
};

export const addProblem = async (problem, token) => {
  try {
    const response = await axios.post(
      "/api/problems",
      { ...problem },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    if ("response" in error && "data" in error.response)
      return error.response.data;
    return error;
  }
};

export const editProblem = async (problem, token) => {
  try {
    const response = await axios.patch(
      `/api/problems/${problem._id}`,
      problem,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    if ("response" in error && "data" in error.response)
      return error.response.data;
    return error;
  }
};

export const getTestCases = async (problemId) => {
  try {
    const response = await axios.get(`/api/testCases/problem/${problemId}`);
    return response.data;
  } catch (error) {
    if ("response" in error && "data" in error.response)
      return error.response.data;
    return error;
  }
};

export const addTestCase = async (testcase, problemId, token) => {
  try {
    const response = await axios.post(`/api/testCases/${problemId}`, testcase, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    if ("response" in error && "data" in error.response)
      return error.response.data;
    return error;
  }
};

export const deleteTestCase = async (testCaseId, token) => {
  try {
    const response = await axios.delete(`/api/testCases/${testCaseId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    if ("response" in error && "data" in error.response)
      return error.response.data;
    return error;
  }
};
