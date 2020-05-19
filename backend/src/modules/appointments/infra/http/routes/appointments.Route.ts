import { Router } from 'express';
import 'reflect-metadata';

import EnsureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import AppointmentsController from '../controllers/AppointmentsControllers';

const appointmentRouter = Router();
const appointmentsController = new AppointmentsController();

appointmentRouter.use(EnsureAuthenticated);

// appointmentRouter.get('/', async (request, response) => {
//   const appointmentsRepository = getCustomRepository(AppointmentsRepository);
//   return response.json(await appointmentsRepository.find());
// });

appointmentRouter.post('/', appointmentsController.create);

export default appointmentRouter;
