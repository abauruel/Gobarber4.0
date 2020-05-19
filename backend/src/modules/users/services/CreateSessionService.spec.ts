import AppError from '@shared/errors/AppErro';
import FakeUsersRepository from '../repositories/fake/FakeUserRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateSessionService from './CreateSessionService';
import CreateUserService from './CreateUserService';

describe('CreateSession', () => {
  it('should not be able to authenticate with email noneexist', async () => {
    const fakeUserRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createSessionService = new CreateSessionService(
      fakeUserRepository,
      fakeHashProvider,
    );
    const createUserService = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );

    await createUserService.create({
      email: '123@123.com',
      password: '123456',
      name: 'teste',
    });

    const user = await createSessionService.execute({
      email: '123@123.com',
      password: '123456',
    });

    expect(user).toHaveProperty('token');
  });

  it('should not be able to authenticate with email noneexist', async () => {
    const fakeUserRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createSessionService = new CreateSessionService(
      fakeUserRepository,
      fakeHashProvider,
    );

    expect(
      createSessionService.execute({
        email: '111@123.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with password wrong', async () => {
    const fakeUserRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createSessionService = new CreateSessionService(
      fakeUserRepository,
      fakeHashProvider,
    );

    const createUserService = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );

    await createUserService.create({
      email: '123@123.com',
      password: '123456',
      name: 'teste',
    });

    expect(
      createSessionService.execute({
        email: '123@123.com',
        password: '123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
