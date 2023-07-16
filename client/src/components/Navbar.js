import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import cookie from "js-cookie";
import { Logout } from "../redux/userSlice";

const Navbar = () => {
  const { user: currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const logout = () => {
    cookie.remove("token");
    dispatch(Logout());
    navigate("/login");
  };

  return (
    <div className="flex justify-between py-4 px-6 bg-gray-900 text-white items-center">
      <h1
        className="font-bold text-xl cursor-pointer"
        onClick={() => navigate("/problems")}>
        {"</>"} Codility
      </h1>
      {currentUser ? (
        <h1 className="bg-white text-black font-bold p-2 rounded-xl flex gap-4 items-center">
          Hi {currentUser?.name}
          &nbsp;{" "}
          <FiLogOut className="text-xl cursor-pointer" onClick={logout  } />
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
