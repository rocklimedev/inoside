// router/routes.js
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";
import Table from "../components/Dashboard/Dashboard";
import AddProject from "../components/Inventory/AddProject";
import InventoryList from "../components/Inventory/InventoryList";
import ProjectDetails from "../components/Inventory/ProjectDetails";

const masterRoutes = [
  {
    path: "/",
    name: "Dashboard",
    icon: null, // you can add an icon later like <Layout />
    isSidebarActive: true,
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
  {
    path: "/add-project",
    name: "Add Project",
    isSidebarActive: false,
    element: <AddProject />,
  },
  {
    path: "/projects/list",
    name: "List Projects",
    isSidebarActive: false,
    element: <InventoryList />,
  },
  {
    path: "/project/:id",
    name: "Project Details",
    isSidebarActive: false,
    element: <ProjectDetails />,
  },
];

export default masterRoutes;
