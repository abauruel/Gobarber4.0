import AppError from '@shared/errors/AppErro';
import FakeUsersRepository from '../repositories/fake/FakeUserRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateSessionService from './CreateSessionService';
import CreateUserService from './CreateUserService';

let fakeUserRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createSessionService: CreateSessionService;
let createUserService: CreateUserService;

describe('CreateSession', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createSessionService = new CreateSessionService(
      fakeUserRepository,
      fakeHashProvider,
    );
    createUserService = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );
  });

  it('should not be able to authenticate with email noneexist', async () => {
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
    await expect(
      createSessionService.execute({
        email: '111@123.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with password wrong', async () => {
    await createUserService.create({
      email: '123@123.com',
      password: '123456',
      name: 'teste',
    });

    await expect(
      createSessionService.execute({
        email: '123@123.com',
        password: '123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
