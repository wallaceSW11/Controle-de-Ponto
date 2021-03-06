import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import PrivateRoute from './utils/PrivateRoute';

import Logon from './pages/Logon';
import Horario from './pages/Horario';
import HorarioAutomatico from './pages/HorarioAutomatico';

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Logon} />
        <PrivateRoute path='/horario' component={Horario} />
        <PrivateRoute path='/horarioAutomatico' component={HorarioAutomatico} />
      </Switch>
    </BrowserRouter>
  );
}
