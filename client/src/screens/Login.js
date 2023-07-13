import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { login } from "../apiCalls/user";

const Login = () => {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (name) => (e) => {
    setUser({ ...user, [name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user.username === "" || user.password === "")
      toast.error("Please Fill every field");
    else {
      try {
        // dispatch(ShowLoading());
        const response = await login(user);
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
              Codility
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
                  value={user.username}
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
                  value={user.password}
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
                <Link className="mt-3" to="/signup">
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
