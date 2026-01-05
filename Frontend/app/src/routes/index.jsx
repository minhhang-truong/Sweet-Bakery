// src/routes/index.jsx
import { createBrowserRouter } from "react-router-dom";
import { customerRoutes } from "./client/customer.routes.jsx";
import { employeeRoutes } from "./employee/employee.route.jsx";
import { managerRoutes } from "./admin/manager.route.jsx";

export const router = createBrowserRouter([
  ...customerRoutes,
  ...employeeRoutes,
  ...managerRoutes,
]);
