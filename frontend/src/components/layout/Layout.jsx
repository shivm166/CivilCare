import React from "react";
import Container from "./Container.jsx";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <div>
        <Container>
          <Outlet/>
        </Container>
      </div>
    </>
  );
};

export default Layout;
