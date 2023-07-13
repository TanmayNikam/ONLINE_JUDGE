import React, { useState, useEffect } from "react";
import { getAllProblems } from "../apiCalls/problems";
import { toast } from "react-hot-toast";

const Problems = () => {
  const [page, setPage] = useState(1);
  const [problemsList, setProblemsList] = useState([]);
  const [problem, setProblem] = useState(null);

  const fetchProblems = async () => {
    try {
      const response = await getAllProblems();
      if (!response.success) toast.error(response.message);
      setProblemsList(response.problems);
    } catch (error) {
      toast.error("Error fetching problems");
      console.log(error);
    }
  };

  useEffect(() => {
    if (problemsList.length === 0) fetchProblems();
  }, []);

  return <div>Problems</div>;
};

export default Problems;
