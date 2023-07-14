import React, { useState, useEffect } from "react";
import { getAllProblems } from "../apiCalls/problems";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { SetCurrentProblem, SetProblemsList } from "../redux/problemsSlice";

const Problems = () => {
  const [page, setPage] = useState(1);
  const { problems: allProblems } = useSelector((state) => state.problems);
  const [problemsList, setProblemsList] = useState(allProblems);

  const dispatch = useDispatch();

  const fetchProblems = async () => {
    try {
      const response = await getAllProblems();
      if (!response.success) toast.error(response.message);
      setProblemsList(response.problems);
      dispatch(SetProblemsList(response.problems));
    } catch (error) {
      toast.error("Error fetching problems");
      console.log(error);
    }
  };

  const setProblem = (problemId) => {
    dispatch(SetCurrentProblem(problemId));
  };

  useEffect(() => {
    if (problemsList.length === 0) fetchProblems();
  }, []);

  const difficultyColor = (diff) => {
    return diff === "Easy"
      ? "#02ab02"
      : diff === "Medium"
      ? "#c7c702"
      : "#c70c02";
  };

  const problemListItem = (problem) => (
    <tr
      className="cursor-pointer "
      onClick={() => setProblem(problem._id)}
      key={problem._id}>
      <td className="p-3">{problem.title}</td>
      <td className="p-3">
        <span
          style={{ backgroundColor: difficultyColor(problem.difficulty) }}
          className="py-1 px-4 rounded-full">
          {problem.difficulty}
        </span>
      </td>
    </tr>
  );

  return (
    <div className="p-10 min-h-screen">
      <div className="text-left p-4">
        <h1 className="text-2xl font-bold mb-5">Problems</h1>
        <div className="w-2/3 text-center">
          <table className="w-full">
            <tr>
              <th className="w-2/3">Title</th>
              <th className="w-1/3">Difficutly</th>
            </tr>
            {problemsList.map((item) => problemListItem(item))}
          </table>
        </div>
      </div>
    </div>
  );
};

export default Problems;
