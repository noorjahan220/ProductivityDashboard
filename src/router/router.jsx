import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import Login from './../Pages/Login';
import Register from './../Pages/Register';
import Dashboard from './../Pages/Dashboard';
import PrivateRoute from './../PrivateRoute/PrivateRoute';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/dashboard",
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

export default router;
