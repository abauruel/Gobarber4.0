import AppError from '@shared/errors/AppErro';
import FakeUserRepository from '../repositories/fake/FakeUserRepository';
import FakeUserTokenRepository from '../repositories/fake/FakeUserTokenRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import ResetPasswordService from './ResetPasswordService';

let fakeuserRepository: FakeUserRepository;
let fakeUserTokenRepository: FakeUserTokenRepository;
let resetPasswordService: ResetPasswordService;
let fakeHashProvider: FakeHashProvider;

describe('ResetPassword', () => {
  beforeEach(() => {
    fakeuserRepository = new FakeUserRepository();
    fakeUserTokenRepository = new FakeUserTokenRepository();
    fakeHashProvider = new FakeHashProvider();
    resetPasswordService = new ResetPasswordService(
      fakeuserRepository,
      fakeUserTokenRepository,
      fakeHashProvider,
    );
  });

  it('should be able to reset password', async () => {
    const user = await fakeuserRepository.create({
      name: 'John Doe',
      email: 'johndoe@teste.com',
      password: '123456',
    });

    const { idtoken: token } = await fakeUserTokenRepository.generate(user.id);
    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    await resetPasswordService.execute({
      token,
      password: '121212',
    });
    const userUpdated = await fakeuserRepository.findById(user.id);

    expect(generateHash).toHaveBeenCalledWith('121212');
    expect(userUpdated?.password).toBe('121212');
  });
  it('should not be ale  to reset password when user nonexit', async () => {
    await fakeuserRepository.create({
      name: 'John Doe',
      email: 'johndoe@teste.com',
      password: '123456',
    });
    const { idtoken: token } = await fakeUserTokenRepository.generate(
      'none-exist-user',
    );

    await expect(
      resetPasswordService.execute({
        token,
        password: '121212',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be ale  to reset password when token nonexit', async () => {
    await expect(
      resetPasswordService.execute({
        token: 'token-not-exits-test',
        password: '121212',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset password  after 2 hours requested', async () => {
    const user = await fakeuserRepository.create({
      name: 'John Doe',
      email: 'johndoe@teste.com',
      password: '123456',
    });
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    });

    const { idtoken: token } = await fakeUserTokenRepository.generate(user.id);

    await expect(
      resetPasswordService.execute({
        token,
        password: '121212',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
