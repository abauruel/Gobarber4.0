import AppError from '@shared/errors/AppErro';
import { injectable, inject } from 'tsyringe';

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IUserRepository from '../repositories/IUserRepository';
import IUserTokenRepository from '../repositories/IUserTokenRepository';

interface IRequest {
  email: string;
}
@injectable()
class SendForgotPasswordEmail {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,

    @inject('UserToken')
    private userToken: IUserTokenRepository,
  ) {}

  public async execute({ email }: IRequest): Promise<void> {
    const checkUserExist = await this.userRepository.findEmail(email);
    if (!checkUserExist) {
      throw new AppError('User does not exist');
    }

    await this.mailProvider.sendEmail(email, 'Pedido de recuperação de senha');
  }
}

export default SendForgotPasswordEmail;
