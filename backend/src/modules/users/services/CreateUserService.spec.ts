import AppError from '@shared/errors/AppErro';
import FakeuserRepository from '../repositories/fake/FakeUserRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserRepository from './CreateUserService';

describe('CreateUserService', () => {
  it('should be create a new user', async () => {
    const fakeUserRepository = new FakeuserRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUserRepository = new CreateUserRepository(
      fakeUserRepository,
      fakeHashProvider,
    );

    const user = await createUserRepository.create({
      name: '123',
      password: '123',
      email: '123@123.com',
    });

    expect(user).toHaveProperty('id');
  });

  it('should be create a new user with the same email already', async () => {
    const fakeUserRepository = new FakeuserRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUserRepository = new CreateUserRepository(
      fakeUserRepository,
      fakeHashProvider,
    );

    await createUserRepository.create({
      name: '123',
      password: '123',
      email: '123@123.com',
    });

    expect(
      createUserRepository.create({
        name: '1233',
        password: '1233',
        email: '123@123.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
