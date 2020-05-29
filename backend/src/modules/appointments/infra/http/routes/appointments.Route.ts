import { Router } from 'express';
import 'reflect-metadata';
import { celebrate, Segments, Joi } from 'celebrate';
import EnsureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import AppointmentsController from '../controllers/AppointmentsControllers';
import ListProviderAppointmentsController from '../controllers/ProviderAppointmentsController';

const appointmentRouter = Router();
const appointmentsController = new AppointmentsController();
const listProviderAppointmentsController = new ListProviderAppointmentsController();

appointmentRouter.use(EnsureAuthenticated);

appointmentRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      provider_id: Joi.string().uuid().required(),
      date: Joi.date().required(),
    },
  }),
  appointmentsController.create,
);
appointmentRouter.get(
  '/me',
  celebrate({
    [Segments.BODY]: {
      day: Joi.number().required(),
      month: Joi.number().required(),
      year: Joi.number().required(),
    },
  }),
  listProviderAppointmentsController.index,
);

export default appointmentRouter;
