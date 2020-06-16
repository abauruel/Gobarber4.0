import React from 'react';
import { Switch } from 'react-router-dom';
import Route from './Route';
import SingIn from '../pages/signin';
import SignUp from '../pages/signup';
import ForgotPassword from '../pages/forgotPassword';
import ResetPassword from '../pages/resetPassword';

import Dashboard from '../pages/Dashboard';
import Profile from '../pages/profile';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={SingIn} />
    <Route path="/signup" component={SignUp} />
    <Route path="/forgotpassword" component={ForgotPassword} />
    <Route path="/reset-password" component={ResetPassword} />

    <Route path="/profile" component={Profile} isPrivate />
    <Route path="/dashboard" component={Dashboard} isPrivate />
  </Switch>
);

export default Routes;
