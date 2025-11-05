import React from "react";
import Container from "./Container.jsx";
import Header from "../layout/header/Header.jsx";
import Footer from "../layout/footer/Footer.jsx";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <div>
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
