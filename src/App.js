import { Route, Redirect, Switch } from "react-router-dom";
import React from "react";

import Result from "./components/Result";
import TimeEntry from "./components/TimeEntry";

import "./App.css";

function App() {
  return (
    <main className="container">
      <Switch>
        <Route
          path="/time-entry"
          render={(props) => <TimeEntry {...props} />}
        />
        <Route path="/result" render={(props) => <Result {...props} />} />
        <Redirect from="/" exact to="/time-entry" />
        <Redirect to="/time-entry" />
      </Switch>
    </main>
  );
}

export default App;
