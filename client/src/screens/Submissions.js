import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { getSubmissions } from "../apiCalls/submissions";
import cookie from "js-cookie";
import toast from "react-hot-toast";
import CodeModal from "../components/CodeModal";

const Submissions = () => {
  const location = useLocation();
  const submissionType = location.pathname.includes("all") ? "All" : "My";
  const [submissions, setSubmissions] = useState([]);
  const [showCode, setShowCode] = useState(false);
  let userToken = "";
  const { problemId } = useParams();
  if (cookie.get("token")) userToken = cookie.get("token");

  const langName = {
    py: "Python",
    js: "Javascript",
    c: "C",
    cpp: "CPP",
    java: "Java",
  };

  const fetchSubmissions = async () => {
    try {
      const response = await getSubmissions(
        submissionType,
        userToken,
        problemId
      );
      if (response.success) {
        setSubmissions(response.submissions);
      } else toast.error(response.message);
    } catch (error) {
      toast.error("Error fetching submissions");
      console.log(error);
    }
  };

  const verdictColor = (verdict) =>
    verdict === "Accepted" ? "green" : verdict === "Pending" ? "gray" : "red";

  useEffect(() => {
    fetchSubmissions();
  }, []);

  return (
    <>
      {showCode && <CodeModal />}
      <div>
        <div className="text-left p-10">
          <h1 className="text-2xl font-bold">{submissionType} Submissions</h1>
          <div className="p-10 text-center items-center flex justify-center">
            <table className="w-3/4 border border-black">
              <tbody>
                <tr className="p-3 bg-blue-200">
                  <th className="border border-black border-r-2 font-bold">
                    Username
                  </th>
                  <th className="border border-black border-r-2 font-bold">
                    Problem
                  </th>
                  <th className="border border-black border-r-2 font-bold">
                    Language
                  </th>
                  <th className="border border-black border-r-2 font-bold">
                    Runtime
                  </th>
                  <th className="border border-black border-r-2 font-bold">
                    Verdict
                  </th>
                  <th className="border border-black border-r-2 font-bold">
                    Code
                  </th>
                  {/* <th>Username</th> */}
                </tr>
                {submissions &&
                  submissions.map((item) => (
                    <tr className="p-4">
                      <td className="border border-black border-r-2 font-semibold">
                        {item.user.username}
                      </td>
                      <td className="border border-black border-r-2 font-semibold">
                        {item.problem.title}
                      </td>
                      <td className="border border-black border-r-2 font-semibold">
                        {langName[item.language]}
                      </td>
                      <td className="border border-black border-r-2 font-semibold">
                        {item.runtime} ms
                      </td>
                      <td
                        className="border border-black border-r-2 font-bold"
                        style={{ color: verdictColor(item.verdict) }}>
                        {item.verdict}
                      </td>
                      <td className="border border-black border-r-2 font-semibold">
                        {/* <!--Button trigger vertically centered scrollable modal--> */}
                        <button
                          type="button"
                          class="inline-block bg-red-500 px-2 py-1 m-1 rounded-md text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                          data-te-toggle="modal"
                          data-te-target="#exampleModalCenteredScrollable"
                          data-te-ripple-init
                          data-te-ripple-color="light"
                          onClick={() => setShowCode(true)}>
                          {"</>"}
                        </button>
                        {/* <button className="bg-red-500 roundex-xl p-1 m-1">
                        {"</>"}
                      </button> */}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Submissions;
