import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import ForgotPasswordController from '../controllers/ForgotPasswordController';
import ResetPasswordController from '../controllers/ResetPasswordController';

const passwordRoute = Router();
const forgotPasswordController = new ForgotPasswordController();
const resetPasswordController = new ResetPasswordController();

passwordRoute.post(
  '/forgot',
  celebrate({
    [Segments.BODY]: Joi.string().email().required(),
  }),
  forgotPasswordController.create,
);
passwordRoute.post(
  '/reset',
  celebrate({
    [Segments.BODY]: {
      token: Joi.string().uuid(),
      password: Joi.string().required(),
      password_confirmation: Joi.string().valid(Joi.ref('password')).required(),
    },
  }),
  resetPasswordController.create,
);

export default passwordRoute;
