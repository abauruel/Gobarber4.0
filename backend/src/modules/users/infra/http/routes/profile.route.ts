import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import ProfileController from '../controllers/ProfileController';

const profileRoute = Router();
const profileController = new ProfileController();

profileRoute.use(ensureAuthenticated);
profileRoute.put('/', profileController.update);

export default profileRoute;
