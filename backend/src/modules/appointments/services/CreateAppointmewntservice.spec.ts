import AppError from '@shared/errors/AppErro';
import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentRepository';
import CreateAppointmentService from './CreateAppointmentService';

describe('CreateAppointment', () => {
  it('should be create a new appointment', async () => {
    const fakeAppointmentRepository = new FakeAppointmentRepository();
    const createAppointmentService = new CreateAppointmentService(
      fakeAppointmentRepository,
    );
    const appointment = await createAppointmentService.execute({
      provider_id: '123',
      date: new Date(),
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123');
  });

  it('should be able to create a new appointment on same time', async () => {
    const fakeAppointmentRepository = new FakeAppointmentRepository();
    const createAppointmentService = new CreateAppointmentService(
      fakeAppointmentRepository,
    );

    const appointmentData = new Date();

    await createAppointmentService.execute({
      provider_id: '123',
      date: appointmentData,
    });

    expect(
      createAppointmentService.execute({
        provider_id: '12',
        date: appointmentData,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
