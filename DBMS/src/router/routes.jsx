import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";
import Table from "../components/Dashboard/Dashboard";

const masterRoutes = [
  {
    path: "/",
    name: "Dashboard",
    isSidebarActive: false,
    element: <Table />,
  },
  {
    path: "/login",
    name: "Login",
    isSidebarActive: false,
    element: <Login />,
  },
  {
    path: "/register",
    name: "Signup",
    isSidebarActive: false,
    element: <Register />,
  },
];

export default masterRoutes;
