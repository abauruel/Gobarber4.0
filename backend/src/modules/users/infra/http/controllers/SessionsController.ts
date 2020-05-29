import { Request, Response } from 'express';
import { container } from 'tsyringe';
import AuthenticationService from '@modules/users/services/CreateSessionService';
import { classToClass } from 'class-transformer';

class SessionsController {
  async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;
    const authenticationUser = container.resolve(AuthenticationService);
    const { user, token } = await authenticationUser.execute({
      email,
      password,
    });

    return response.json({ user: classToClass(user), token });
  }
}

export default SessionsController;
