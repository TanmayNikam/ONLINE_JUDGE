import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./App.css";
import Login from "./screens/Login";
import Register from "./screens/Register";
import Home from "./screens/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import Problems from "./screens/Problems";
import PublicRoute from "./components/PublicRoute";
import Problem from "./screens/Problem";
import Submissions from "./screens/Submissions";
import AdminRoute from "./components/AdminRoute";
import AddEditProblem from "./screens/Admin/AddEditProblem";

function App() {
  return (
    <div className="App">
      <Toaster position="top-center" reverseOrder={false} />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/problems"
            element={
              <PublicRoute>
                <Problems />
              </PublicRoute>
            }
          />
          <Route
            path="/problems/:problemId"
            element={
              <PublicRoute>
                <Problem />
              </PublicRoute>
            }
          />
          <Route
            path="/submissions/all/:problemId"
            element={
              <PublicRoute>
                <Submissions />
              </PublicRoute>
            }
          />
          <Route
            path="/submissions/my/:problemId"
            element={
              <ProtectedRoute>
                <Submissions />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route
            path="/admin/problems"
            element={
              <AdminRoute>
                <Problems />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/problems/add"
            element={
              <AdminRoute>
                <AddEditProblem />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/problems/edit/:problemId"
            element={
              <AdminRoute>
                <AddEditProblem />
              </AdminRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
