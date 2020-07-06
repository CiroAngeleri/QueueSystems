import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import App from '../src/App'

export default function Main() {
  return (
    <Router>
        <Switch>
          <Route exact path="/">
            <App type="M/M/1"/>
          </Route>
          <Route path="/mg1">
            <App type="M/G/1"/>
          </Route>
          <Route path="/md1">
            <App type="M/D/1"/>
          </Route>
        </Switch>
    </Router>
  );
}