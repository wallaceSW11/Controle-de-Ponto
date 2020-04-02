import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import estaLogado from '../utils/auth';

export const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    estaLogado() ? (
      <Component {...props} />
    ) : (
        <Redirect to={{ pathname: '/', state: { from: props.location } }} />
      )
  )} />
)

export default PrivateRoute;
