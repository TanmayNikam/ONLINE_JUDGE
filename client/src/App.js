import logo from "./logo.svg";
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
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
