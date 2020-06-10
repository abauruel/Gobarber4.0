import { getRepository, Repository, Raw } from 'typeorm';
import IAppointmentRepository from '@modules/appointments/repositories/IAppoinmentRepository';
import ICreateAppointmentDto from '@modules/appointments/dtos/ICreateAppointmentDto';
import IFindAllIInDayProviderDTO from '@modules/appointments/dtos/IFindAllIInDayProviderDTO';
import IFindAllMonthFromProviderDTO from '../../../dtos/IFindAllInMonthFromProviderDTO';

import Appointment from '../entities/Appointment';

class AppointmentsRepository implements IAppointmentRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async findAllDayInProvider({
    provider_id,
    day,
    month,
    year,
  }: IFindAllIInDayProviderDTO): Promise<Appointment[]> {
    const parsedDay = String(day).padStart(2, '0');
    const parsedMonth = String(month).padStart(2, '0');
    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'DD-MM-YYYY')= '${parsedDay}-${parsedMonth}-${year}'`,
        ),
      },
    });

    return appointments;
  }

  public async findAllInMonthFromProvider({
    month,
    provider_id,
    year,
  }: IFindAllMonthFromProviderDTO): Promise<Appointment[]> {
    const parsedMonth = String(month).padStart(2, '0');
    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'MM-YYYY')= '${parsedMonth}-${year}'`,
        ),
      },
    });

    return appointments;
  }

  public async findBydate(
    date: Date,
    provider_id: string,
  ): Promise<Appointment | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: {
        date,
        provider_id,
      },
    });
    return findAppointment;
  }

  public async create({
    user_id,
    provider_id,
    date,
  }: ICreateAppointmentDto): Promise<Appointment> {
    const appointment = this.ormRepository.create({
      provider_id,
      date,
      user_id,
    });
    await this.ormRepository.save(appointment);
    return appointment;
  }
}

export default AppointmentsRepository;
