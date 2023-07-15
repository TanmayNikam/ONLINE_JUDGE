import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const { user: currentUser } = useSelector((state) => state.user);

  const navigate = useNavigate();
  return (
    <div className="flex justify-between py-4 px-6 bg-gray-900 text-white items-center">
      <h1
        className="font-bold text-xl cursor-pointer"
        onClick={() => navigate("/problems")}>
        {"</>"} Codility
      </h1>
      {currentUser ? (
        <h1 className="bg-white text-black font-bold p-2 rounded-xl">
          Hi {currentUser?.name}
        </h1>
      ) : (
        <button
          className="text-md text-black bg-white px-3 py-2 rounded-xl"
          onClick={() => navigate("/login")}>
          Login
        </button>
      )}
    </div>
  );
};

export default Navbar;
