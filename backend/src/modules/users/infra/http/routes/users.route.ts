import { Router } from 'express';
import multer from 'multer';

import multerConfig from '@config/multer';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import UserAvatarController from '../controllers/UserAvatarController';
import UserController from '../controllers/UsersController';

const usersRoute = Router();
const userAvatarController = new UserAvatarController();
const userController = new UserController();
const upload = multer(multerConfig);

usersRoute.post('/', userController.create);

usersRoute.patch(
  '/',
  ensureAuthenticated,
  upload.single('avatar'),
  userAvatarController.update,
);

export default usersRoute;
