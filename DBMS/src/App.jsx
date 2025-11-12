import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import Header from "./components/Common/Header";
import Sidebar from "./components/Common/Sidebar";
import Tables from "./components/Dashboard/Dashboard";
import Footer from "./components/Common/Footer";
function App() {
  const [count, setCount] = useState(0);

  return (
    <div class="main-wrapper">
      <Header />
      <div class="page-wrapper">
        <Tables />
        <Footer />
      </div>
    </div>
  );
}

export default App;
