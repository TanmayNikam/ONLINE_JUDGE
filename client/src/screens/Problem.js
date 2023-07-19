import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { addSubmission } from "../apiCalls/submissions";
import cookie from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";
import { getProblemById } from "../apiCalls/problems";

const Problem = () => {
  const navigate = useNavigate();
  const { problemId } = useParams();
  const [problem, setProblem] = useState(null);
  const { user } = useSelector((state) => state.user);
  const [code, setCode] = useState("");
  const availableLanguages = ["cpp", "c", "js", "py", "java"];
  const [language, setLanguage] = useState(availableLanguages[0]);
  const langName = {
    py: "Python",
    js: "Javascript",
    c: "C",
    cpp: "CPP",
    java: "Java",
  };

  const fetchProblem = async () => {
    try {
      const response = await getProblemById(problemId);
      if (response.success) {
        setProblem(response.problem);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Error fetching Problem");
      console.log(error);
    }
  };

  useEffect(() => {
    if (!problem) fetchProblem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitSubmission = async () => {
    if (!user) toast.error("Login to submit solution");
    if (!code) toast.error("Enter code for submission");
    try {
      // console.log(language, code);
      const response = await addSubmission(
        language,
        code,
        problem._id,
        cookie.get("token")
      );
      // console.log(response);
      if (response.success) navigate(`/submissions/all/${problem._id}`);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <>
      {problem && (
        <div className="w-full text-left p-10">
          <div className="flex gap-4 mb-5">
            <button
              className="border border-blue-500 p-2 rounded-md"
              onClick={() => navigate(`/`)}>
              <span className="text-lg">{"<"}</span> Problems
            </button>
            <button
              className="border border-red-500 p-2 rounded-md"
              onClick={() => navigate(`/submissions/my/${problem._id}`)}>
              My Submissions <span className="text-lg">{">"}</span>
            </button>
            <button
              className="bg-red-500 text-white rounded-md px-2"
              onClick={() => navigate(`/submissions/all/${problem._id}`)}>
              All Submissions <span className="text-lg">{">"}</span>
            </button>
          </div>
          <div className="w-full flex h-[75vh] gap-10">
            <div className="w-1/2 border border-black p-3 overflow-y-auto">
              <h1 className="text-xl font-semibold mb-2">Problem Statement</h1>
              <p className="mb-2">{problem?.description}</p>
              <h1 className="text-lg font-semibold mb-2">Input Format</h1>
              <p className="mb-2">{problem?.ipFormat}</p>
              <h1 className="text-lg font-semibold mb-2">Output Format</h1>
              <p className="mb-2">{problem?.opFormat}</p>
              <h1 className="text-lg font-semibold mb-2">Sample Input</h1>
              <textarea
                className="border border-black rounded-lg w-full h-[15vh] p-3"
                value={problem?.sampleInput}
                disabled
              />
              <h1 className="text-lg font-semibold mb-2">Sample Output</h1>
              <textarea
                className="border border-black rounded-lg w-full h-[15vh] p-3"
                value={problem?.sampleOutput}
                disabled
              />
            </div>
            <div className="w-1/2 h-[70vh]">
              <div className="flex gap-4 mb-5">
                <h2>Langauge</h2>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="border border-black">
                  {availableLanguages.map((lang) => (
                    <option value={lang} onClick={() => setLanguage(lang)}>
                      {langName[lang]}
                    </option>
                  ))}
                </select>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="border border-black w-full h-[63vh] p-2"
                style={{
                  fontFamily: '"Fira code", "Fira Mono", monospace',
                  fontSize: 16,
                }}
                placeholder="Enter your code here"
              />
              <div className="flex justify-end">
                <button
                  className="bg-red-500 text-white font-semibold text-lg p-2 rounded-md"
                  onClick={submitSubmission}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Problem;
