import FakeUserRepository from '@modules/users/repositories/fake/FakeUserRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProfile';
import ListProviderService from './ListProvideServicer';

let fakeUserRepository: FakeUserRepository;
let fakeCacheProvider: FakeCacheProvider;
let listProviderService: ListProviderService;

describe('ListProviderService', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProviderService = new ListProviderService(
      fakeUserRepository,
      fakeCacheProvider,
    );
  });
  it('should be able to list all providers', async () => {
    const user1 = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    });
    const user2 = await fakeUserRepository.create({
      name: 'John Tre',
      email: 'johntre@gmail.com',
      password: '123456',
    });
    const userlogged = await fakeUserRepository.create({
      name: 'John Qua',
      email: 'johnqua@gmail.com',
      password: '123456',
    });
    const providers = await listProviderService.execute({
      user_id: userlogged.id,
    });

    expect(providers).toEqual([user1, user2]);
  });
});
