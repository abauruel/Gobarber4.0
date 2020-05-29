import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProfile';
import FakeAppointmetnRepository from '../repositories/fakes/FakeAppointmentRepository';
import ListProviderAppointmentService from './ListProviderAppointmentService';

let fakeAppointmentRepository: FakeAppointmetnRepository;
let listProviderAppointmentService: ListProviderAppointmentService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListAppointmentsProvider', () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmetnRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProviderAppointmentService = new ListProviderAppointmentService(
      fakeAppointmentRepository,
      fakeCacheProvider,
    );
  });
  it('should be able to return all appointments of day', async () => {
    const appointment1 = await fakeAppointmentRepository.create({
      provider_id: 'babeiro01',
      user_id: 'cliente01',
      date: new Date(2020, 4, 20, 8),
    });
    const appointment2 = await fakeAppointmentRepository.create({
      provider_id: 'babeiro01',
      user_id: 'cliente02',
      date: new Date(2020, 4, 20, 10),
    });
    const appointments = await listProviderAppointmentService.execute({
      provider_id: 'babeiro01',
      day: 20,
      month: 5,
      year: 2020,
    });

    expect(appointments).toEqual([appointment1, appointment2]);
  });
});
