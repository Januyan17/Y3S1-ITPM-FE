

import React from 'react';
import Admin from "./admin"
import Users from "./users"
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";





class Navigation extends React.Component {

  render() {
    return (
  <Router>
    <Switch>
      <Route exact path="/admin">
        <Admin />
      </Route>
      <Route path="/users">
        <Users />
      </Route>
    </Switch>
  </Router>

    )
}

}
export default () => <Navigation />;