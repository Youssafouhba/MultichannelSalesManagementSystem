import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { AppDataProvider } from '../context/AppDataContext';
import { useAuth } from './Authentification';

function SecureRoute({ component: Component, ...rest }) {
  const { userIsAuthenticated } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) =>
        userIsAuthenticated() ? (
          <AppDataProvider>
          <Component {...props} />
          </AppDataProvider>
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
}

export default SecureRoute;
