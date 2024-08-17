import React, { lazy } from "react";
import {
  Redirect,
  Route,
  BrowserRouter as Router,
  Switch,
} from "react-router-dom";
import AccessibleNavigationAnnouncer from "./components/AccessibleNavigationAnnouncer";
import { Authentification } from "./security/Authentification";
import SecureRoute from './security/SecureRoute'; // Correct import



const Layout = lazy(() => import("./containers/Layout"));
const Login = lazy(() => import("./pages/Login"));


function App() {
  return (
    <>
    <Authentification>

      <Router>
        <AccessibleNavigationAnnouncer />
        <Switch>
          <Route path="/login" component={Login} />
      
          {/* Place new routes over this */}
          <SecureRoute path="/app" component={Layout} />
          {/* If you have an index page, you can remothis Redirect */}
          <Redirect exact from="/" to="/login" />
        </Switch>
      </Router>
      </Authentification>
    </>
  );
}

export default App;
