import { uuid } from 'uuidv4';
import UserToken from '@modules/users/infra/typeorm/entities/UserToken';
import AppError from '@shared/errors/AppErro';
import IUserTokenRepository from '../IUserTokenRepository';

class FakeUserTokenRepository implements IUserTokenRepository {
  private usersToken: UserToken[] = [];

  public async generate(id: string): Promise<UserToken> {
    const userToken = new UserToken();
    Object.assign(userToken, {
      id: uuid(),
      token: uuid(),
      user_id: id,
      created_at: new Date(),
      updated_at: new Date(),
    });
    this.usersToken.push(userToken);
    return userToken;
  }

  public async findbyToken(token: string): Promise<UserToken | undefined> {
    const userToken = await this.usersToken.find(
      tokenFind => tokenFind.token === token,
    );

    if (!userToken) {
      throw new AppError('Invalid Token');
    }

    return userToken;
  }
}

export default FakeUserTokenRepository;
