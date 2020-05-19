import User from '../infra/typeorm/entities/User';
import ICreateUserDTO from '../dtos/ICreateUserDTO';

export default interface IUserRepository {
  findById(id: string): Promise<User | undefined>;
  findEmail(email: string): Promise<User | undefined>;
  create(userData: ICreateUserDTO): Promise<User>;
  save(user: User): Promise<User>;
}
