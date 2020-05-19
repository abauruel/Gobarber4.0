import { Request, Response } from 'express';
import { container } from 'tsyringe';
import AuthenticationService from '@modules/users/services/CreateSessionService';

class SessionsController {
  async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;
    const authenticationUser = container.resolve(AuthenticationService);
    const { user, token } = await authenticationUser.execute({
      email,
      password,
    });
    delete user.password;
    return response.json({ user, token });
  }
}

export default SessionsController;
