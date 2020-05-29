import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import ProfileController from '../controllers/ProfileController';

const profileRoute = Router();
const profileController = new ProfileController();

profileRoute.use(ensureAuthenticated);
profileRoute.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string(),
      email: Joi.string(),
      old_password: Joi.string(),
      password: Joi.string().when('old_password', {
        is: true,
        then: Joi.required(),
        otherwise: Joi.optional(),
      }),
      password_confirmation: Joi.string().when('password', {
        is: true,
        then: Joi.string().valid(Joi.ref('password')).required(),
        otherwise: Joi.optional(),
      }),
    },
  }),
  profileController.update,
);
profileRoute.get('/', profileController.show);

export default profileRoute;
