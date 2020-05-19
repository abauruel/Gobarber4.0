import { Router } from 'express';
import AppointmentsRouter from '@modules/appointments/infra/http/routes/appointments.Route';
import UsersRouter from '@modules/users/infra/http/routes/users.route';
import SessionRouter from '@modules/users/infra/http/routes/session.route';
import PasswordRouter from '@modules/users/infra/http/routes/password.route';

const routes = Router();
routes.use('/appointments', AppointmentsRouter);
routes.use('/users', UsersRouter);
routes.use('/session', SessionRouter);
routes.use('/password', PasswordRouter);

export default routes;