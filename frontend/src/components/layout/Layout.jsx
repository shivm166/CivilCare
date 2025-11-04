import React from "react";
import Container from "./Container.jsx";
import HomePage from "../../pages/home/HomePage";

const Layout = () => {
  return (
    <>
      <div>
        <Container>
          <HomePage />
        </Container>
      </div>
    </>
  );
};

export default Layout;
