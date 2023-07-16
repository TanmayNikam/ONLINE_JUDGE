import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getSubmissions } from "../apiCalls/submissions";
import cookie from "js-cookie";
import toast from "react-hot-toast";
import { BiArrowBack } from "react-icons/bi";
import Modal from "../components/Modal";
// import CodeModal from "../components/CodeModal";
// import Modal from "../components/Modal";

const Submissions = () => {
  const location = useLocation();
  const submissionType = location.pathname.includes("all") ? "All" : "My";
  const [submissions, setSubmissions] = useState([]);
  const [showCode, setShowCode] = useState("");
  let userToken = "";
  const { problemId } = useParams();
  if (cookie.get("token")) userToken = cookie.get("token");
  const navigate = useNavigate();

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
      {showCode && <Modal showModal={showCode} setShowModal={setShowCode} />}
      <div>
        <div className="text-left p-10">
          <BiArrowBack
            className="text-3xl mb-3 cursor-pointer"
            onClick={() => navigate(`/problems/${problemId}`)}
          />
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
                  {submissionType === "My" && (
                    <th className="border border-black border-r-2 font-bold">
                      Code
                    </th>
                  )}
                  {/* <th>Username</th> */}
                </tr>
                {submissions &&
                  submissions.map((item) => (
                    <tr className="p-4" key={item._id}>
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
                      {submissionType === "My" && (
                        <td className="border border-black border-r-2 font-semibold">
                          <button
                            type="button"
                            data-modal-target="defaultModal"
                            data-modal-toggle="defaultModal"
                            onClick={() => setShowCode(item._id)}
                            className="bg-red-500 rounded-lg p-1">
                            {"</>"}
                          </button>
                        </td>
                      )}
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
