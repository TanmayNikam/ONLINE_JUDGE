import React, { useState, useEffect } from "react";
import { getAllProblems, getProblemById } from "../apiCalls/problems";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { SetProblemsList } from "../redux/problemsSlice";
import { useNavigate } from "react-router-dom";

const Problems = () => {
  const [page, setPage] = useState(1);
  const { problems: allProblems } = useSelector((state) => state.problems);
  const [problemsList, setProblemsList] = useState(allProblems);
  const navigate = useNavigate();

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

  const setProblem = async (problemId) => {
    // dispatch(SetCurrentProblem(problemId));
    navigate(`/problems/${problemId}`);
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

  const problemListItem = (problem, index) => (
    <tr
      className="cursor-pointer border border-black"
      onClick={() => setProblem(problem._id)}
      key={problem._id}>
      <td>{index + 1}</td>
      <td className="p-3 border border-black border-r-2">{problem.title}</td>
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
        <div className="text-center items-center flex justify-center">
          <table className="w-2/3">
            <tbody>
              <tr className="border border-black ">
                <th className="w-1/4">Sr No.</th>
                <th className="w-1/2">Title</th>
                <th className="w-1/4">Difficutly</th>
              </tr>
              {problemsList.map((item, ind) => problemListItem(item, ind))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Problems;
