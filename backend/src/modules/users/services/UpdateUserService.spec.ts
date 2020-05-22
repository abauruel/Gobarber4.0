import AppError from '@shared/errors/AppErro';
import 'reflect-metadata';
import FakeStorageRepository from '@shared/container/providers/StorageProvider/fakes/FakestorageProvider';
import UpdateUserService from './UpdateUserservice';

import FakeUsersRepository from '../repositories/fake/FakeUserRepository';

let fakeStorageRepository: FakeStorageRepository;
let fakeUserRepository: FakeUsersRepository;

let updateUserService: UpdateUserService;

describe('UpdateAvatar', () => {
  beforeEach(() => {
    fakeStorageRepository = new FakeStorageRepository();
    fakeUserRepository = new FakeUsersRepository();

    updateUserService = new UpdateUserService(
      fakeUserRepository,
      fakeStorageRepository,
    );
  });
  it('should not be able to authenticate with email noneexist', async () => {
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
    await expect(
      updateUserService.execute({
        user_id: 'nonexist-user',
        avatarfilename: 'avatar.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should be able to delete old avatar when update a new', async () => {
    const deleteFile = jest.spyOn(fakeStorageRepository, 'deleteFile');

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
