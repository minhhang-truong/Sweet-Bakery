import CustomerRoute from "./CustomerRoute.jsx";

import HomePage from "../../pages/customer/HomePage.jsx";
import AllMenu from "../../pages/customer/AllMenu.jsx";
import SearchResults from "../../pages/customer/SearchResults/SearchResults.jsx";
import SignInPages from "../../pages/customer/Login/SignIn.jsx";
import SignUpPages from "../../pages/customer/Signup/SignUp.jsx";
import Cart from "../../pages/customer/Cart/Cart.jsx";
import Checkout from "../../pages/customer/Checkout/Checkout.jsx";
import Account from "../../pages/customer/Account/Account.jsx";
import HistoryPage from "../../pages/customer/History/History.jsx";
import OrderSuccess from "../../pages/customer/OrderSuccess/OrderSuccess.jsx";
import OrderTracking from "../../pages/customer/OrderTracking/OrderTracking.jsx";
import AboutPage from "../../pages/customer/AboutPage.jsx";
import ContactPage from "../../pages/customer/ContactPage.jsx";
import FaqPage from "../../pages/customer/FaqPage.jsx";
import PublicLayout from "../../layouts/PublicLayout.jsx";
import ChangePassword from "../../pages/customer/ChangePassword/ChangePassword.jsx";

export const customerRoutes = [
    {
        path: "/",
        element: (
          <PublicLayout>
            <CustomerRoute>
              <HomePage />
            </CustomerRoute>
          </PublicLayout>
        ),
    },
    {
        path: "/menu",
        element: (
          <PublicLayout>
            <CustomerRoute>
              <AllMenu />
            </CustomerRoute>
          </PublicLayout>
        ),
    },
    {
        path: "/menu/:slug",
        element: (
          <PublicLayout>
            <CustomerRoute>
              <AllMenu />
            </CustomerRoute>
          </PublicLayout>
        ),
    },
  {
        path: "/search",
        element: (
          <PublicLayout>
            <CustomerRoute>
              <SearchResults />
            </CustomerRoute>
          </PublicLayout>
        ),
    },
    {
        path: "/signin",
        element: (
          <PublicLayout>
            <CustomerRoute>
              <SignInPages />
            </CustomerRoute>
          </PublicLayout>
        ),
    },
    {
        path: "/signup",
        element: (
          <PublicLayout>
            <CustomerRoute>
              <SignUpPages />
            </CustomerRoute>
          </PublicLayout>
        ),
    },
    {
        path: "/about",
        element: (
          <PublicLayout>
            <CustomerRoute>
              <AboutPage />
            </CustomerRoute>
          </PublicLayout>
        ),
    },
    {
        path: "/contact",
        element: (
          <PublicLayout>
            <CustomerRoute>
              <ContactPage />
            </CustomerRoute>
          </PublicLayout>
        ),
    },
    {
        path: "/faq",
        element: (
          <PublicLayout>
            <CustomerRoute>
              <FaqPage />
            </CustomerRoute>
          </PublicLayout>
        ),
    },
    {
        path: "/cart",
        element: (
          <PublicLayout>
            <CustomerRoute>
              <Cart />
            </CustomerRoute>
          </PublicLayout>
        ),
    },
    {
        path: "/checkout",
        element: (
          <PublicLayout>
            <CustomerRoute>
              <Checkout />
            </CustomerRoute>
          </PublicLayout>
        ),
    },
    {
        path: "/account",
        element: (
          <PublicLayout>
            <CustomerRoute>
              <Account />
            </CustomerRoute>
          </PublicLayout>
        ),
    },
    {
        path: "/change-password",
        element: (
          <PublicLayout>
            <CustomerRoute>
              <ChangePassword />
            </CustomerRoute>
          </PublicLayout>
        ),
    },
    {
        path: "/orders",
        element: (
          <PublicLayout>
            <CustomerRoute>
              <HistoryPage />
            </CustomerRoute>
          </PublicLayout>
        ),
    },
    {
        path: "/order-success/:orderId",
        element: (
          <PublicLayout>
            <CustomerRoute>
              <OrderSuccess />
            </CustomerRoute>
          </PublicLayout>
        ),
    },
    {
        path: "/track/:orderId",
        element: (
          <PublicLayout>
            <CustomerRoute>
              <OrderTracking />
            </CustomerRoute>
          </PublicLayout>
        ),
    },
];