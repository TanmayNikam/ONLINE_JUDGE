import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import cookie from "js-cookie";
import { getUser } from "../apiCalls/user";
import { SetUser } from "../redux/userSlice";
// import { toast } from "react-hot-toast";
import Navbar from "./Navbar";

const PublicRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.user);

  const fetchUser = async () => {
    try {
      const response = await getUser(cookie.get("token"));
      if (response.success) dispatch(SetUser(response.user));
      else cookie.remove("token");
    } catch (error) {
      // toast.error("Something went wrong");
      console.log(error);
    }
  };

  useEffect(() => {
    if (!currentUser && cookie.get("token")) fetchUser();
  }, []);


  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default PublicRoute;
