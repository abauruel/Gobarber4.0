import IUserTokenRepository from '@modules/users/repositories/IUserTokenRepository';
import { Repository, getRepository } from 'typeorm';

import UserToken from '../entities/UserToken';

class UserTokenRepository implements IUserTokenRepository {
  private ormRepository: Repository<UserToken>;

  constructor() {
    this.ormRepository = getRepository(UserToken);
  }

  public async generate(id: string): Promise<UserToken> {
    const userToken = this.ormRepository.create({
      user_id: id,
    });

    await this.ormRepository.save(userToken);

    return userToken;
  }

  public async findbyToken(token: string): Promise<UserToken | undefined> {
    const userToken = await this.ormRepository.findOne({
      where: { idtoken: token },
    });

    return userToken;
  }
}

export default UserTokenRepository;
