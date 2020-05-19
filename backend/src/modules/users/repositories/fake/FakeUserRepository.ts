import IUserRepository from '@modules/users/repositories/IUserRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import { uuid } from 'uuidv4';
import User from '../../infra/typeorm/entities/User';

class UserRepository implements IUserRepository {
  private users: User[] = [];

  public async findById(id: string): Promise<User | undefined> {
    const foundUser = this.users.find(user => user.id === id);
    return foundUser;
  }

  public async findEmail(email: string): Promise<User | undefined> {
    const foundUser = this.users.find(user => user.email === email);
    return foundUser;
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = new User();
    const newUser = Object.assign(user, { id: uuid() }, userData);
    this.users.push(newUser);
    return newUser;
  }

  public async save(user: User): Promise<User> {
    const userFound = this.users.findIndex(
      searchUser => searchUser.id === user.id,
    );
    this.users[userFound] = user;
    return user;
  }
}

export default UserRepository;
