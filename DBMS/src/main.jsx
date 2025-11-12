// index.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux"; // <-- Import Provider
import { store } from "./config/store.js"; // <-- Import your store
import "./index.css";
import App from "./App.jsx";

// Render the app with Redux Provider
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
