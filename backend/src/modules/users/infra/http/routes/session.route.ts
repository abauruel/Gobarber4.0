import { Router } from 'express';
import SessionController from '../controllers/SessionsController';

const sessionRoute = Router();
const sessionController = new SessionController();

sessionRoute.post('/', sessionController.create);

export default sessionRoute;
