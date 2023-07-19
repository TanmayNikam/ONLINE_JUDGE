import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  addProblem,
  addTestCase,
  deleteTestCase,
  editProblem,
  getProblemById,
  getTestCases,
} from "../../apiCalls/problems";
import toast from "react-hot-toast";
import cookie from "js-cookie";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { SetProblemsList } from "../../redux/problemsSlice";

const AddEditProblem = () => {
  const urlParams = useParams();
  const navigate = useNavigate();
  const isEdit = "problemId" in urlParams ? true : false;
  const difficultyOptions = ["Easy", "Medium", "Hard"];
  const [problem, setProblem] = useState({
    title: "",
    description: "",
    ipFormat: "",
    opFormat: "",
    difficulty: difficultyOptions[0],
    sampleInput: "",
    sampleOutput: "",
    timelimit: 1000,
  });

  let { problems: allProblems } = useSelector((state) => state.problems);
  const dispatch = useDispatch();

  const [testCases, setTestCases] = useState([]);
  const [currentTestCase, setCurrentTestCase] = useState({
    input: "",
    output: "",
  });

  const fetchProblem = async () => {
    try {
      const response = await getProblemById(urlParams.problemId);
      if (response.success) {
        setProblem(response.problem);
        const testCaseResponse = await getTestCases(response.problem._id);
        if (testCaseResponse.success) {
          setTestCases(testCaseResponse.testCases);
        } else toast.error(testCaseResponse.message);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Error fetching Problem");
      console.log(error);
    }
  };

  useEffect(() => {
    if (isEdit) fetchProblem();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (name) => (e) => {
    setProblem((prev) => ({ ...prev, [name]: e.target.value }));
  };

  const handleTestCaseChange = (name) => (e) => {
    setCurrentTestCase({ ...currentTestCase, [name]: e.target.value });
  };

  const handleProblemSubmit = async () => {
    try {
      let response;
      if (!isEdit) response = await addProblem(problem, cookie.get("token"));
      else response = await editProblem(problem, cookie.get("token"));
      if (response.success) {
        toast.success(response.message);
        if (isEdit)
          allProblems = allProblems.map((item) =>
            response.problem._id === item._id ? response.problem : item
          );
        else allProblems = [...allProblems, response.problem];
        dispatch(SetProblemsList(allProblems));
        navigate("/admin/problems");
      } else {
        if (response.message.includes("Path validation failed"))
          toast.error("Input all required fields");
        else toast.error(response.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
  };

  const deleteTestcase = async (testCaseId) => {
    try {
      const response = await deleteTestCase(testCaseId, cookie.get("token"));
      if (response.success) {
        setTestCases((prev) => prev.filter((item) => item._id !== testCaseId));
        toast.success(response.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
  };

  const addTestcase = async () => {
    if (currentTestCase.input === "" || currentTestCase.output === "") {
      toast.error("Enter both input and output");
      return;
    }
    try {
      const response = await addTestCase(
        currentTestCase,
        problem._id,
        cookie.get("token")
      );
      if (response.success) {
        toast.success(response.message);
        setTestCases((prev) => [...prev, response.testCase]);
        setCurrentTestCase({ input: "", output: "" });
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="p-10 text-left w-3/4">
      <BiArrowBack
        className="text-3xl mb-3 cursor-pointer"
        onClick={() => navigate("/admin/problems")}
      />
      <h1 className="text-3xl font-bold">{isEdit ? "Edit" : "Add"} Problem</h1>
      <div className="p-10">
        <div className="flex w-full justify-between mb-8">
          <div className="w-1/2">
            <h1 className="text-lg">Title</h1>
            <input
              type="text"
              className="w-3/4 border border-black rounded-md h-10 p-2"
              value={problem.title}
              onChange={handleChange("title")}
            />
          </div>
          <div className="w-1/4">
            <h1 className="text-lg">Time limit(ms)</h1>
            <input
              type="Number"
              min={1000}
              step={1000}
              className="w-3/4 border border-black rounded-md h-10 p-2"
              value={problem.timelimit}
              onChange={handleChange("timelimit")}
            />
          </div>
          <div className="w-1/4">
            <h1 className="text-lg">Difficutly Level</h1>
            <select
              value={problem.difficulty}
              onChange={handleChange("difficulty")}
              className="w-3/4 border border-black rounded-md h-10 p-2">
              {difficultyOptions.map((item, ind) => (
                <option key={ind}>{item}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mb-8">
          <h1 className="text-lg">Description</h1>
          <textarea
            className="w-full border border-black rounded-md h-36 p-2"
            value={problem.description}
            onChange={handleChange("description")}
          />
        </div>
        <div className="flex w-full justify-between mb-8">
          <div className="w-1/2">
            <h1 className="text-lg">Input Format</h1>
            <textarea
              type="text"
              className="w-3/4 border border-black rounded-md h-20 p-2"
              value={problem.ipFormat}
              onChange={handleChange("ipFormat")}
            />
          </div>
          <div className="w-1/2">
            <h1 className="text-lg">Output Format</h1>
            <textarea
              type="text"
              className="w-3/4 border border-black rounded-md h-20 p-2"
              value={problem.opFormat}
              onChange={handleChange("opFormat")}
            />
          </div>
        </div>
        <div className="flex w-full justify-between mb-8">
          <div className="w-1/2">
            <h1 className="text-lg">Sample Input</h1>
            <textarea
              type="text"
              className="w-3/4 border border-black rounded-md h-28 p-2"
              value={problem.sampleInput}
              onChange={handleChange("sampleInput")}
            />
          </div>
          <div className="w-1/2">
            <h1 className="text-lg">Sample Output</h1>
            <textarea
              type="text"
              className="w-3/4 border border-black rounded-md h-28 p-2"
              value={problem.sampleOutput}
              onChange={handleChange("sampleOutput")}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <button
          className="bg-blue-400 p-2 rounded-lg"
          onClick={() => {
            handleProblemSubmit();
          }}>
          {isEdit ? "Edit" : "Add"} Problem
        </button>
      </div>
      {isEdit && (
        <div>
          <h1 className="text-2xl font-bold mb-5">Add Testcase</h1>
          <div className="flex w-full justify-between mb-8 gap-10">
            <div className="w-1/2">
              <h1 className="text-lg">Input</h1>
              <textarea
                type="text"
                className="w-full border border-black rounded-md h-28 p-2"
                value={currentTestCase.input}
                onChange={handleTestCaseChange("input")}
              />
            </div>
            <div className="w-1/2">
              <h1 className="text-lg">Output</h1>
              <textarea
                type="text"
                className="w-full border border-black rounded-md h-28 p-2"
                value={currentTestCase.output}
                onChange={handleTestCaseChange("output")}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              className="bg-yellow-500 p-2 rounded-md"
              onClick={addTestcase}>
              Add Testcase
            </button>
          </div>
          {testCases && (
            <div>
              <h1 className="text-lg font-semibold m-2">Test Cases</h1>
              <ul className="border border-black w-1/4">
                {testCases.map((item, ind) => (
                  <li
                    className="border border-b-2 border-gray-200 p-2 flex justify-between items-center"
                    key={item._id}>
                    <span
                      className="cursor-pointer hover:underline"
                      onClick={() => {
                        setCurrentTestCase({
                          input: item.input,
                          output: item.output,
                        });
                      }}>
                      Test Case {ind + 1}
                    </span>
                    <MdOutlineDeleteOutline
                      className="text-red-400 text-xl cursor-pointer"
                      onClick={() => deleteTestcase(item._id)}
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AddEditProblem;
