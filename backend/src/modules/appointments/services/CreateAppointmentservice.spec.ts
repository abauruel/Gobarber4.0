import AppError from '@shared/errors/AppErro';
import FakeNotificationRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProfile';
import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentRepository';

import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentRepository: FakeAppointmentRepository;
let createAppointmentService: CreateAppointmentService;
let fakeNotificationRepository: FakeNotificationRepository;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();
    fakeNotificationRepository = new FakeNotificationRepository();
    fakeCacheProvider = new FakeCacheProvider();
    createAppointmentService = new CreateAppointmentService(
      fakeAppointmentRepository,
      fakeNotificationRepository,
      fakeCacheProvider,
    );
  });
  it('should be create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const appointment = await createAppointmentService.execute({
      provider_id: '123',
      user_id: '12345',
      date: new Date(2020, 4, 10, 14),
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123');
  });
  it('should not be able create a new appointment without provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointmentService.execute({
        provider_id: '',
        user_id: '12345',
        date: new Date(2020, 4, 10, 14),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new appointment on same time', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const appointmentData = new Date(2020, 4, 10, 15);

    await createAppointmentService.execute({
      provider_id: '123',
      user_id: '12345',
      date: appointmentData,
    });

    await expect(
      createAppointmentService.execute({
        provider_id: '123',
        user_id: '123455',
        date: appointmentData,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to create a appointment before now', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointmentService.execute({
        provider_id: '12',
        user_id: '12345',
        date: new Date(2020, 4, 10, 11),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointmentService.execute({
        provider_id: '12',
        user_id: '12',
        date: new Date(2020, 4, 10, 13),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to create a appointment before 8am and after 5pm ', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 6).getTime();
    });

    await expect(
      createAppointmentService.execute({
        provider_id: 'provider-id',
        user_id: 'user-id',
        date: new Date(2020, 4, 10, 7),
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointmentService.execute({
        provider_id: 'provider-id',
        user_id: 'user-id',
        date: new Date(2020, 4, 10, 18),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
