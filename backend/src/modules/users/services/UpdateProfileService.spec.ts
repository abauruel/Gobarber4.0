import AppError from '@shared/errors/AppErro';
import 'reflect-metadata';

import FakeUsersRepository from '../repositories/fake/FakeUserRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from './UpdateProfileService';

let fakeUserRepository: FakeUsersRepository;

let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfileService = new UpdateProfileService(
      fakeUserRepository,
      fakeHashProvider,
    );
  });
  it('should be ale to update profile ', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'Johndoe@gmail.com',
      password: '1234',
    });

    const userUpdated = await updateProfileService.execute({
      user_id: user.id,
      name: 'John Tre',
      email: 'johntre@gmail.com',
    });

    expect(userUpdated.name).toBe('John Tre');
  });

  it('should not be ale to update profile with nonexit user ', async () => {
    await fakeUserRepository.create({
      name: 'John Doe',
      email: 'Johndoe@gmail.com',
      password: '1234',
    });

    await expect(
      updateProfileService.execute({
        user_id: 'none-exist',
        name: 'John Tre',
        email: 'johntre@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be ale to update profile using existing email ', async () => {
    const user1 = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'Johndoe@gmail.com',
      password: '1234',
    });

    const user = await fakeUserRepository.create({
      name: 'TEst',
      email: 'Teste@gmail.com',
      password: '1234',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: user1.name,
        email: user1.email,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should  be ale to update password ', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'Johndoe@gmail.com',
      password: '1234',
    });
    const userupdated = await updateProfileService.execute({
      user_id: user.id,
      name: 'John Tre',
      email: 'Johndoe2@gmail.com',
      old_password: '1234',
      password: '1111',
    });
    expect(userupdated.password).toBe('1111');
  });

  it('should not be ale to update password without old password ', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'Johndoe@gmail.com',
      password: '1234',
    });
    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'John Tre',
        email: 'Johndoe2@gmail.com',
        password: '1111',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be ale to update password with old password wrong  ', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'Johndoe@gmail.com',
      password: '1234',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'John Tre',
        email: 'Johndoe2@gmail.com',
        password: '12345',
        old_password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
