import React, { useState, useEffect } from "react";
import { getAllProblems } from "../apiCalls/problems";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { SetProblemsList } from "../redux/problemsSlice";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";
import { BiArrowBack } from "react-icons/bi";

const Problems = () => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const location = useLocation();
  const isAdminPage = location.pathname.includes("admin");
  const isAdmin = useSelector((state) => state.user.user?.isadmin);
  const { problems: allProblems } = useSelector((state) => state.problems);
  const [problemsList, setProblemsList] = useState(allProblems);
  const [searchKey, setSearchKey] = useState("");
  const difficulties = ["All", "Easy", "Medium", "Hard"];
  const [difficultyFilter, setDifficultyFilter] = useState(difficulties[0]);

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

  useEffect(() => {
    if (problemsList?.length === 0) fetchProblems();
  }, []);

  const handlePageChange = (name) => {
    if (name === "next") {
      if (page < totalPages) setPage(page + 1);
    } else {
      if (page > 1) setPage(page - 1);
    }
  };

  useEffect(() => {
    let newProblemsList =
      difficultyFilter === "All"
        ? allProblems
        : allProblems?.filter((item) => item.difficulty === difficultyFilter);
    if (searchKey)
      newProblemsList = newProblemsList?.filter((item) =>
        item.title.toLowerCase().includes(searchKey.toLowerCase())
      );
    // newProblemsList = newProblemsList.slice((page - 1) * 10, 10);
    setTotalPages(Math.ceil(newProblemsList?.length / 10));
    setProblemsList(newProblemsList);
  }, [difficultyFilter, searchKey, allProblems]);

  const difficultyColor = (diff) => {
    return diff === "Easy"
      ? "#02ab02"
      : diff === "Medium"
      ? "#c7c702"
      : "#c70c02";
  };

  const problemListItem = (problem, index) => (
    <tr className="cursor-pointer border border-black" key={problem._id}>
      <td className="p-3 border border-black">
        <Link to={`/problems/${problem._id}`} className="hover:underline">
          {problem.title}
        </Link>
      </td>
      <td className={`p-3 ${isAdminPage && "border border-black"}`}>
        <span
          style={{ backgroundColor: difficultyColor(problem.difficulty) }}
          className="py-1 px-4 rounded-full">
          {problem.difficulty}
        </span>
      </td>
      {isAdminPage && (
        <td className="p-3 flex justify-center text-center">
          <button
            className="bg-black rounded-md"
            onClick={() => navigate(`/admin/problems/edit/${problem._id}`)}>
            <AiOutlineEdit className="text-2xl cursor-pointer  text-white " />
          </button>
        </td>
      )}
    </tr>
  );

  return (
    <div className="p-10 min-h-screen">
      {isAdminPage && (
        <BiArrowBack
          className="text-3xl mb-3 cursor-pointer"
          onClick={() => navigate("/problems")}
        />
      )}
      <div className="text-left p-4">
        <div className="flex justify-between mb-5">
          <h1 className="text-2xl font-bold">Problems</h1>
          {isAdmin && !isAdminPage && (
            <button
              className="text-md px-3 py-2 rounded-lg bg-yellow-500"
              onClick={() => navigate("/admin/problems")}>
              Edit Problem
            </button>
          )}
          {isAdmin && isAdminPage && (
            <button
              className="text-md px-3 py-2 rounded-lg bg-yellow-500"
              onClick={() => navigate("/admin/problems/add")}>
              Add Problem
            </button>
          )}
        </div>
        <div className="w-2/3 mx-auto">
          <div className="flex items-center justify-between mb-7">
            <input
              placeholder="Search Problem"
              className="border border-black py-2 px-4 rounded-full w-1/3"
              value={searchKey}
              onChange={(e) => {
                setSearchKey(e.target.value);
                // setPage(1);
              }}
            />
            <div className="flex gap-5 items-center">
              <label>Difficulty</label>
              <select
                value={difficultyFilter}
                onChange={(e) => {
                  setDifficultyFilter(e.target.value);
                  // setPage(1);
                }}
                className="p-2 rounded-lg border border-black">
                {difficulties.map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="text-center items-center flex justify-center">
          <table className="w-2/3">
            <tbody>
              <tr className="border border-black ">
                <th className={isAdmin ? "w-2/5" : "w-1/2"}>Title</th>
                <th className={isAdmin ? "w-1/5" : "w-1/4"}>Difficutly</th>
                {isAdminPage && <th className="w-1/5">Actions</th>}
              </tr>
              {problemsList
                ?.slice(
                  (page - 1) * 10,
                  Math.min(problemsList.length, page * 10)
                )
                .map((item, ind) => problemListItem(item, ind))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex justify-end w-5/6 gap-4 mt-4">
            <button
              className="p-2 border border-black rounded-lg cursor-pointer"
              onClick={() => handlePageChange("prev")}>
              {"<"} Prev
            </button>
            <button
              className="p-2 border border-black rounded-lg cursor-pointer"
              onClick={() => handlePageChange("next")}>
              Next {">"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Problems;
