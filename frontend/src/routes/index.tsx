import React from 'react';
import { Switch } from 'react-router-dom';
import Route from './Route';
import SingIn from '../pages/signin';
import SignUp from '../pages/signup';

import Dashboard from '../pages/Dashboard';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={SingIn} />
    <Route path="/signup" component={SignUp} />

    <Route path="/dashboard" component={Dashboard} isPrivate />
  </Switch>
);

export default Routes;