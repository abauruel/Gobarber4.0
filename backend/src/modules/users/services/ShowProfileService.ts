import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppErro';

import IUserRepository from '../repositories/IUserRepository';
import User from '../infra/typeorm/entities/User';

interface IRequest {
  user_id: string;
}

@injectable()
class ShowProfileService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
  ) {}

  public async execute({ user_id }: IRequest): Promise<User> {
    const user = await this.userRepository.findById(user_id);
    if (!user) {
      throw new AppError('User does not exists');
    }
    return user;
  }
}

export default ShowProfileService;
