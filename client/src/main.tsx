import ReactDOM from "react-dom/client";
import "./main.scss";

import App from "./App";
import { BrowserRouter } from "react-router-dom";
import SWRFetcher from "./SWRFetcher";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <SWRFetcher>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </SWRFetcher>
  // </React.StrictMode>
);
