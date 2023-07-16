import React, { useEffect } from "react";
// import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  // const user = useSelector((state) => state.user);
  useEffect(() => {
    navigate("/problems");
  }, []);
  return <div>Home</div>;
};

export default Home;
