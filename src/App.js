import { Route, Redirect, Switch } from "react-router-dom";
import React, { Component } from "react";

import Result from "./components/result";
import TimeEntry from "./components/timeEntry";

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
      </Switch>
    </main>
  );
}

export default App;
