import React from "react";
import Container from "./Container.jsx";
import HomePage from "../../pages/home/HomePage";
import Header from "../layout/header/Header.jsx";
import Footer from "../layout/footer/Footer.jsx";

const Layout = () => {
  return (
    <>
      <div>
        <Header />
        <Container>
          <HomePage />
        </Container>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
