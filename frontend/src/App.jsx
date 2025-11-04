import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout.jsx";
import HomePage from "./pages/home/HomePage.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />} >
        <Route path="/" element={<HomePage />} />
      </Route>
    </Routes>
  );
};

export default App;
