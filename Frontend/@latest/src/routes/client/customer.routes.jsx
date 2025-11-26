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

export const customerRoutes = [
    {
        path: "/",
        element: (
          <CustomerRoute>
            <HomePage />
          </CustomerRoute>
        ),
    },
    {
        path: "/menu",
        element: (
          <CustomerRoute>
            <AllMenu />
          </CustomerRoute>
        ),
    },
    {
        path: "/menu/:slug",
        element: (
          <CustomerRoute>
            <AllMenu />
          </CustomerRoute>
        ),
    },
  {
        path: "/search",
        element: (
          <CustomerRoute>
            <SearchResults />
          </CustomerRoute>
        ),
    },
    {
        path: "/signin",
        element: (
          <CustomerRoute>
            <SignInPages />
          </CustomerRoute>
        ),
    },
    {
        path: "/signup",
        element: (
          <CustomerRoute>
            <SignUpPages />
          </CustomerRoute>
        ),
    },
    {
        path: "/about",
        element: (
          <CustomerRoute>
            <AboutPage />
          </CustomerRoute>
        ),
    },
    {
        path: "/contact",
        element: (
          <CustomerRoute>
            <ContactPage />
          </CustomerRoute>
        ),
    },
    {
        path: "/faq",
        element: (
          <CustomerRoute>
            <FaqPage />
          </CustomerRoute>
        ),
    },
    {
        path: "/cart",
        element: (
          <CustomerRoute>
            <Cart />
          </CustomerRoute>
        ),
    },
    {
        path: "/checkout",
        element: (
          <CustomerRoute>
            <Checkout />
          </CustomerRoute>
        ),
    },
    {
        path: "/account",
        element: (
          <CustomerRoute>
            <Account />
          </CustomerRoute>
        ),
    },
    {
        path: "/orders",
        element: (
          <CustomerRoute>
            <HistoryPage />
          </CustomerRoute>
        ),
    },
    {
        path: "/order-success/:orderId",
        element: (
          <CustomerRoute>
            <OrderSuccess />
          </CustomerRoute>
        ),
    },
    {
        path: "/track/:orderId",
        element: (
          <CustomerRoute>
            <OrderTracking />
          </CustomerRoute>
        ),
    },
];