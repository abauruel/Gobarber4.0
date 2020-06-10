import { startOfHour, isBefore, getHours, format } from 'date-fns';
import AppError from '@shared/errors/AppErro';
import { injectable, inject } from 'tsyringe';
import INotificationRepository from '@modules/notifications/repositories/INotificationRepository';
import ICacheProviders from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import Appointment from '../infra/typeorm/entities/Appointment';

import IAppointmentRepository from '../repositories/IAppoinmentRepository';

interface IRequest {
  date: Date;
  provider_id: string;
  user_id: string;
}
@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentRepository')
    private appointmentRepository: IAppointmentRepository,

    @inject('NotificationRepository')
    private notificationRepository: INotificationRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProviders,
  ) {}

  public async execute({
    date,
    provider_id,
    user_id,
  }: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    if (!provider_id) {
      throw new AppError('Provider is required');
    }
    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError("You can't create appointment on the past date");
    }

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError('You can only create appointment between 8am at 5pm');
    }
    if (user_id === provider_id) {
      throw new AppError("You can't create appoinment with same user");
    }
    const findAppointmentInSameDate = await this.appointmentRepository.findBydate(
      appointmentDate,
      provider_id,
    );

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked', 401);
    }

    const appointment = await this.appointmentRepository.create({
      user_id,
      provider_id,
      date: appointmentDate,
    });
    const dateFormatted = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm'h'");
    await this.notificationRepository.create({
      recipient_id: appointment.provider_id,
      content: `Novo agendamento realizado para o dia ${dateFormatted}`,
    });

    await this.cacheProvider.invalidate(
      `provider-appointments:${format(appointmentDate, 'yyyy-M-d')}`,
    );

    return appointment;
  }
}
export default CreateAppointmentService;
