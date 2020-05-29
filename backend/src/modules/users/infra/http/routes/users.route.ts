import { Router } from 'express';
import multer from 'multer';

import multerConfig from '@config/multer';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import { celebrate, Segments, Joi } from 'celebrate';
import UserAvatarController from '../controllers/UserAvatarController';
import UserController from '../controllers/UsersController';

const usersRoute = Router();
const userAvatarController = new UserAvatarController();
const userController = new UserController();
const upload = multer(multerConfig);

usersRoute.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      password_confirmed: Joi.string().valid(Joi.ref('password')),
    },
  }),
  userController.create,
);

usersRoute.patch(
  '/',
  ensureAuthenticated,
  upload.single('avatar'),
  userAvatarController.update,
);

export default usersRoute;
