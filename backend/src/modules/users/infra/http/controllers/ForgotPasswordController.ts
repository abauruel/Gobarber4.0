import { Request, Response } from 'express';
import { container } from 'tsyringe';
import SendForgotPasswordEmail from '@modules/users/services/SendForgotPasswordEmail';

class ForgotPasswordController {
  async create(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;

    const sendForgotPasswordService = container.resolve(
      SendForgotPasswordEmail,
    );
    await sendForgotPasswordService.execute({ email });

    return response.status(204).json();
  }
}

export default ForgotPasswordController;
