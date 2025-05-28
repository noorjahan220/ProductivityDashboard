import {
  createBrowserRouter,
 
} from "react-router-dom";
import Main from "../layout/Main";
import Login from "../Pages/Login";
import Register from "../Pages/Register";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main/>,
    children:[
      {
        path: "/",
        element:<Login/>
      },
       {
        path: "/register",
        element:<Register/>
      }
    ]
  },
  
]);

export default router;  