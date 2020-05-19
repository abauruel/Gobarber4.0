import AppError from '@shared/errors/AppErro';
import 'reflect-metadata';
import FakeStorageRepository from '@shared/container/providers/StorageProvider/fakes/FakestorageProvider';
import UpdateUserService from './UpdateUserservice';

import FakeUsersRepository from '../repositories/fake/FakeUserRepository';

describe('UpdateAvatar', () => {
  it('should not be able to authenticate with email noneexist', async () => {
    const fakeStorageRepository = new FakeStorageRepository();
    const fakeUserRepository = new FakeUsersRepository();

    const updateUserService = new UpdateUserService(
      fakeUserRepository,
      fakeStorageRepository,
    );

    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'Johndoe@gmail.com',
      password: '1234',
    });
    await updateUserService.execute({
      user_id: user.id,
      avatarfilename: 'avatar.jpg',
    });

    expect(user.avatar).toBe('avatar.jpg');
  });

  it('should not be able update avatar from nonexist user', async () => {
    const fakeStorageRepository = new FakeStorageRepository();
    const fakeUserRepository = new FakeUsersRepository();

    const updateUserService = new UpdateUserService(
      fakeUserRepository,
      fakeStorageRepository,
    );

    expect(
      updateUserService.execute({
        user_id: 'nonexist-user',
        avatarfilename: 'avatar.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should be able to delete old avatar when update a new', async () => {
    const fakeStorageRepository = new FakeStorageRepository();
    const fakeUserRepository = new FakeUsersRepository();
    const deleteFile = jest.spyOn(fakeStorageRepository, 'deleteFile');

    const updateUserService = new UpdateUserService(
      fakeUserRepository,
      fakeStorageRepository,
    );

    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'Johndoe@gmail.com',
      password: '1234',
    });

    await updateUserService.execute({
      user_id: user.id,
      avatarfilename: 'avatar.jpg',
    });

    await updateUserService.execute({
      user_id: user.id,
      avatarfilename: 'avatar2.jpg',
    });
    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
    expect(user.avatar).toBe('avatar2.jpg');
  });
});
