import Appointment from '../infra/typeorm/entities/Appointment';
import ICreateAppointmentDto from '../dtos/ICreateAppointmentDto';
import IFindAllInMonthFromProviderDTO from '../dtos/IFindAllInMonthFromProviderDTO';
import IFindAllIInDayProviderDTO from '../dtos/IFindAllIInDayProviderDTO';

export default interface IAppointmentRepository {
  create(data: ICreateAppointmentDto): Promise<Appointment>;
  findBydate(date: Date): Promise<Appointment | undefined>;
  findAllInMonthFromProvider(
    data: IFindAllInMonthFromProviderDTO,
  ): Promise<Appointment[]>;
  findAllDayInProvider(data: IFindAllIInDayProviderDTO): Promise<Appointment[]>;
}
