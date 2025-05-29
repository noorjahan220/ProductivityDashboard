import { createBrowserRouter, Navigate } from "react-router-dom";
import Main from "../layout/Main";
import Login from './../Pages/Login';
import Register from './../Pages/Register';
import Dashboard from './../Pages/Dashboard';
import PrivateRoute from './../PrivateRoute/PrivateRoute';
import AddTask from "../Pages/AddTask";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/",
        element: <Navigate to="/login" replace />
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path:"/addTask",
        element: (
          <PrivateRoute>
            <AddTask/>
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        ),
      },
      {
        path: "*",
        element: <Navigate to="/login" replace />
      }
    ],
  },
]);

export default router;
