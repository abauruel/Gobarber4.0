import AppError from '@shared/errors/AppErro';
import FakeUserRepository from '../repositories/fake/FakeUserRepository';
import ShowProfileService from './ShowProfileService';

let fakeUserRepository: FakeUserRepository;
let showProfileService: ShowProfileService;

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    showProfileService = new ShowProfileService(fakeUserRepository);
  });
  it('should be able to show profile', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'Johndoe@gmail.com',
      password: '1234',
    });

    const userProfile = await showProfileService.execute({ user_id: user.id });

    expect(userProfile.id).toBe(user.id);
  });
  it('should not be able to show profile with user nonexits', async () => {
    await expect(
      showProfileService.execute({
        user_id: 'user-none-exits',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
