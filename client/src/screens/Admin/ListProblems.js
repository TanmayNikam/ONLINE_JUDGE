// import React, { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { getAllProblems } from "../../apiCalls/problems";
// import { toast } from "react-hot-toast";

// const ListProblems = () => {
//   const { problems } = useSelector((state) => state.problems);
//   const dispatch = useDispatch();

//   const fetchProblems = async () => {
//     try {
//       const response = await getAllProblems();
//       if (!response.success) toast.error(response.message);
//       dispatch(SetProblemsList(response.problems));
//     } catch (error) {
//       toast.error("Error fetching problems");
//       console.log(error);
//     }
//   };

//   useEffect(() => {}, []);

//   return <div></div>;
// };

// export default ListProblems;
