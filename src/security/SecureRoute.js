import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { useAuth } from './Authentification';

function SecureRoute({ component: Component, ...rest }) {
  const { userIsAuthenticated } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) =>
        userIsAuthenticated() ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
}

export default SecureRoute;
