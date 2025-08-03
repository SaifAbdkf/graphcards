import ReactDOM from "react-dom/client";
import "./main.scss";

import App from "./App";
import { BrowserRouter } from "react-router-dom";
import Fetcher from "./Fetcher";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <BrowserRouter>
    <Fetcher>
      <App />
    </Fetcher>
  </BrowserRouter>
  // </React.StrictMode>
);
