import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { ThemeProvider } from "styles/theme";
import { Provider } from "framework-x";
import { dispatch, getState, subscribeToState } from "./store";
import "./fx";
import "./handlers";
import { startRouter } from "./routes";
import "styles/global.css";
import { evt } from "./app/events";

// const s = require('./index.css');
startRouter(dispatch);
dispatch(evt.INITIALIZE_APP);

ReactDOM.render(
  <React.StrictMode>
    <Provider
      getState={getState}
      dispatch={dispatch}
      subscribeToState={subscribeToState}
    >
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
