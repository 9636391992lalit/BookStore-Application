import  { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Footer from "./components/Footer";
import AllBooks from "./pages/AllBooks";
import ViewBookDetails from "./pages/ViewBookDetails";
import { authActions } from "./store/auth";
import { useDispatch, useSelector } from "react-redux";
import Cart from "./pages/Cart";
import axios from "axios";
import Profile from "./pages/Profile";
import Favourite from "./pages/Favourite";
import OrderHistory from "./pages/OrderHistory";
import Settings from "./pages/Settings";
import AllOrders from "./components/AdminPages/AllOrders";
import AddBook from "./components/AdminPages/AddBook";
import UpdateBooks from "./components/AdminPages/UpdateBooks";
const App = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.role);
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };
  useEffect(() => {
  const fetch = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/getUserData`,
        { headers }
      );
      if (
        localStorage.getItem("id") &&
        localStorage.getItem("token") &&
        localStorage.getItem("role")
      ) {
        dispatch(authActions.login());
        dispatch(authActions.changeRole(localStorage.getItem("role")));
      }
    } catch (error) {
      console.log("Fetch failed:", error.response?.status);
      // ❌ if-condition will NOT execute here
    }
  };

  fetch();
}, []);

  return (
    <div className="">
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/all-books" element={<AllBooks />} />
        <Route path="/view-book-details/:id" element={<ViewBookDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />}>
          {role !== "admin" ? (
            <Route index element={<Favourite />} />
          ) : (
            <Route index element={<AllOrders />} />
          )}
          {role === "admin" && (
            <Route path="/profile/add-book" element={<AddBook />} />
          )}
          <Route path="/profile/OrderHistory" element={<OrderHistory />} />
          <Route path="/profile/settings" element={<Settings />} />
        </Route>
        {role === "admin" && (
          <Route path="/update-book/:id" element={<UpdateBooks />} />
        )}
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
