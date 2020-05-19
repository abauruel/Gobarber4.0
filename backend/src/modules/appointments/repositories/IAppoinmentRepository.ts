import Appointment from '../infra/typeorm/entities/Appointment';
import ICreateAppointmentDto from '../dtos/ICreateAppointmentDto';

export default interface IAppointmentRepository {
  create(data: ICreateAppointmentDto): Promise<Appointment>;
  findBydate(date: Date): Promise<Appointment | undefined>;
}
