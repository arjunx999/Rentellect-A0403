import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home.jsx";
import SignUp from "./Pages/SignUp.jsx";
import Login from "./Pages/Login.jsx";
import Landing from "./Pages/Landing.jsx";
import NotFound from "./Pages/NotFound.jsx";
import ViewBook from "./Pages/ViewBook.jsx";
import ListBook from "./Pages/ListBook.jsx";
// import Checkout from "./Pages/Checkout.jsx";
import Admin from "./Pages/Admin.jsx";
import LocomotiveScroll from "locomotive-scroll";
const App = () => {
  const locomotiveScroll = new LocomotiveScroll();

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/admin/:id" element={<Admin />} />
        {/* <Route path="/checkout/:id" element={<Checkout />} /> */}
        <Route path="/view-book/:id" element={<ViewBook />} />
        <Route path="/list-book" element={<ListBook />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
