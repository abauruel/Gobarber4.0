import { uuid } from 'uuidv4';
import IAppointmentRepository from '@modules/appointments/repositories/IAppoinmentRepository';
import ICreateAppointmentDto from '@modules/appointments/dtos/ICreateAppointmentDto';
import { isEqual, getMonth, getYear, getDate } from 'date-fns';
import IFindAllIInDayProviderDTO from '@modules/appointments/dtos/IFindAllIInDayProviderDTO';
import Appointment from '../../infra/typeorm/entities/Appointment';
import IFindAllMonthFromProviderDTO from '../../dtos/IFindAllInMonthFromProviderDTO';

class FakeAppointmentRepository implements IAppointmentRepository {
  private appointments: Appointment[] = [];

  public async findBydate(
    date: Date,
    provider_id: string,
  ): Promise<Appointment | undefined> {
    const findAppointment = this.appointments.find(
      appointment =>
        isEqual(appointment.date, date) &&
        appointment.provider_id === provider_id,
    );
    return findAppointment;
  }

  public async findAllDayInProvider({
    provider_id,
    month,
    day,
    year,
  }: IFindAllIInDayProviderDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter(appointment => {
      return (
        appointment.provider_id === provider_id &&
        getDate(appointment.date) === day &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year
      );
    });

    return appointments;
  }

  public async findAllInMonthFromProvider({
    month,
    year,
    provider_id,
  }: IFindAllMonthFromProviderDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter(appointment => {
      return (
        appointment.provider_id === provider_id &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year
      );
    });

    return appointments;
  }

  public async create({
    provider_id,
    user_id,
    date,
  }: ICreateAppointmentDto): Promise<Appointment> {
    const appointment = new Appointment();
    Object.assign(appointment, { id: uuid(), provider_id, date, user_id });
    this.appointments.push(appointment);
    return appointment;
  }
}

export default FakeAppointmentRepository;
