import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import AppError from '@shared/errors/AppErro';
import FakeUserRepository from '../repositories/fake/FakeUserRepository';
import FakeUserTokenRepository from '../repositories/fake/FakeUserTokenRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmail';

let fakeMailProvider: FakeMailProvider;
let fakeuserRepository: FakeUserRepository;
let fakeUserTokenRepository: FakeUserTokenRepository;
let sendForgotPasswordEmailService: SendForgotPasswordEmailService;

describe('SendForgotPassword', () => {
  beforeEach(() => {
    fakeMailProvider = new FakeMailProvider();
    fakeuserRepository = new FakeUserRepository();
    fakeUserTokenRepository = new FakeUserTokenRepository();

    sendForgotPasswordEmailService = new SendForgotPasswordEmailService(
      fakeuserRepository,
      fakeMailProvider,
      fakeUserTokenRepository,
    );
  });
  it('should be able to send email to recovery password', async () => {
    const sendEmail = jest.spyOn(fakeMailProvider, 'sendEmail');

    const user = await fakeuserRepository.create({
      name: 'John Doe',
      email: 'johndoe@teste.com',
      password: '123456',
    });
    await sendForgotPasswordEmailService.execute({
      email: user.email,
    });
    expect(sendEmail).toHaveBeenCalled();
  });

  it('should not be able to send email from email nonexist', async () => {
    await expect(
      sendForgotPasswordEmailService.execute({
        email: 'jhondoe@teste.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able generate token when user to forget password', async () => {
    const generated = jest.spyOn(fakeUserTokenRepository, 'generate');
    const user = await fakeuserRepository.create({
      name: 'John Doe',
      email: 'johndoe@teste.com',
      password: '123456',
    });
    await fakeUserTokenRepository.generate(user.id);
    expect(generated).toHaveBeenCalledWith(user.id);
  });
});
