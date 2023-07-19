import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import cookie from "js-cookie";
import { getUser } from "../apiCalls/user";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { SetUser } from "../redux/userSlice";
import Navbar from "./Navbar";

const AdminRoute = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.user);
  const fetchUser = async () => {
    try {
      const response = await getUser(cookie.get("token"));
      if (response.success) {
        dispatch(SetUser(response.user));
        if (!response.user.isadmin) {
          toast.error("Unauthorized Access");
          navigate("/");
        }
      } else {
        cookie.remove("token");
        toast.error("Login Again");
        navigate("/login");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
  };

  useEffect(() => {
    if (!cookie.get("token")) navigate("/login");
    else if (!currentUser) fetchUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <>
        <Navbar />
        {children}
      </>
    </div>
  );
};

export default AdminRoute;
