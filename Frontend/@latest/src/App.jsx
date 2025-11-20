// src/App.jsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import AllMenu from "./pages/AllMenu.jsx";
import SignIn from "./pages/Login/SignIn.jsx";
import SignUp from "./pages/Signup/SignUp.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Account from "./pages/Account/Account.jsx";

const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/menu", element: <AllMenu /> },              // All
  { path: "/menu/:slug", element: <AllMenu /> },        // By category
  { path: "/signin", element: <SignIn /> },            // Sign In
  { path: "/signup", element: <SignUp /> },            // Sign Up
  { path: "/cart", element: <Cart /> },                // Cart
  { path: "/checkout", element: <Checkout /> },
  { path: "/account", element: <Account /> }           // Account
]);

export default function App() { return <RouterProvider router={router} />; }
