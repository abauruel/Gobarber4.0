import AppError from '@shared/errors/AppErro';
import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import Users from '../infra/typeorm/entities/User';
import IUserRepository from '../repositories/IUserRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  name: string;
  email: string;
  password: string;
}
@injectable()
class CreateUserService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('HashProvider')
    private hasProvider: IHashProvider,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async create({ name, email, password }: IRequest): Promise<Users> {
    const checkExists = await this.userRepository.findEmail(email);

    if (checkExists) {
      throw new AppError('Email already exists', 401);
    }
    const passwordHash = await this.hasProvider.generateHash(password);

    const user = this.userRepository.create({
      name,
      email,
      password: passwordHash,
      avatar: 'avatarDefault.png',
    });

    await this.cacheProvider.invalidatePrefix('providers-list:*');

    return user;
  }
}

export default CreateUserService;
