import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Header from "./components/Common/Header";
import Sidebar from "./components/Common/Sidebar";
import Footer from "./components/Common/Footer";
import { Router as AppRoutes } from "./router/Router"; // <-- renamed from Router.js for clarity

function App() {
  return (
    <Router>
      <div className="main-wrapper">
        <Header />
        <div className="page-wrapper">
          <div className="page-content">
            <AppRoutes /> {/* All route rendering handled here */}
          </div>
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;
