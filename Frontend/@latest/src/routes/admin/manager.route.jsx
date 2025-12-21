import ManagerRoute from "./ManagerRoute";
import ManagerDashboard from "../../pages/admin/ManagerDashboard";
import EmployeeManagement from "../../pages/admin/EmployeeManagement";
import ProductManagement from "../../pages/admin/ProductManagement";
import RevenueReport from "../../pages/admin/RevenueReport";
import ManagerLayout from "../../layouts/ManagerLayout.jsx";
import SigninPages from "../../pages/admin/Login/SignIn.jsx";

export const managerRoutes = [
    {
        path: "/manager/dashboard",
        element: (
            <ManagerLayout>
                <ManagerRoute>
                    <ManagerDashboard />
                </ManagerRoute>
            </ManagerLayout>
        ),
    },
    {
        path: "/manager/signin",
        element: (
            <SigninPages/>
        ),
    },
    {
        path: "/manager/employees",
        element: (
            <ManagerLayout>
                <ManagerRoute>
                    <EmployeeManagement />
                </ManagerRoute>
            </ManagerLayout>
        ),
    },
    {
        path: "/manager/products",
        element: (
            <ManagerLayout>
                <ManagerRoute>
                    <ProductManagement />
                </ManagerRoute>
            </ManagerLayout>
        ),
    },
    {
        path: "/manager/revenue",
        element: (
            <ManagerLayout>
                <ManagerRoute>
                    <RevenueReport />
                </ManagerRoute>
            </ManagerLayout>
        ),
    },
]