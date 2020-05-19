import UserToken from '../infra/typeorm/entities/UserToken';

export default interface IUserTokenRepository {
  generate(id: string): Promise<UserToken>;
  findbyToken(token: string): Promise<UserToken | undefined>;
}
