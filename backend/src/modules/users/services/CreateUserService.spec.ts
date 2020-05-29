import AppError from '@shared/errors/AppErro';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProfile';
import FakeuserRepository from '../repositories/fake/FakeUserRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserRepository from './CreateUserService';

let fakeUserRepository: FakeuserRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;
let createUserRepository: CreateUserRepository;

describe('CreateUserService', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeuserRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();
    createUserRepository = new CreateUserRepository(
      fakeUserRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
  });
  it('should be create a new user', async () => {
    const user = await createUserRepository.create({
      name: '123',
      password: '123',
      email: '123@123.com',
    });

    expect(user).toHaveProperty('id');
  });

  it('should be create a new user with the same email already', async () => {
    await createUserRepository.create({
      name: '123',
      password: '123',
      email: '123@123.com',
    });

    await expect(
      createUserRepository.create({
        name: '1233',
        password: '1233',
        email: '123@123.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
