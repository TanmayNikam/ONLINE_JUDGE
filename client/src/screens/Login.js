/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getUser, login } from "../apiCalls/user";
import { useDispatch, useSelector } from "react-redux";
import { SetUser } from "../redux/userSlice";
import cookie from "js-cookie";

const Login = () => {
  const [currentUser, setCurrentUser] = useState({
    username: "",
    password: "",
  });

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleChange = (name) => (e) => {
    setCurrentUser({ ...currentUser, [name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentUser.username === "" || currentUser.password === "")
      toast.error("Please Fill every field");
    else {
      try {
        // dispatch(ShowLoading());
        const response = await login(currentUser);
        // dispatch(HideLoading());
        if (response.success) {
          toast.success(response.message);
          navigate("/");
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        toast.error("Something went wrong");
        // dispatch(HideLoading());
        console.log(error);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="max-w-md w-full mx-auto">
        <div className="bg-white rounded-lg overflow-hidden shadow-md">
          <div className="px-6 py-8">
            <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-4">
              NodeJudge
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="block text-gray-700 text-sm font-bold mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter your username"
                  value={currentUser.username}
                  onChange={handleChange("username")}
                  required
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-gray-700 text-sm font-bold mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter your password"
                  value={currentUser.password}
                  onChange={handleChange("password")}
                  required
                />
              </div>
              <div className="flex items-center justify-center">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                  Sign In
                </button>
              </div>
              <div className="text-center mt-4">
                <Link className="mt-3 hover:underline" to="/signup">
                  Register Here
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
