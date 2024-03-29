import { injectable, inject } from 'tsyringe';
import { getHours, isAfter } from 'date-fns';
import IAppointmentRepository from '../repositories/IAppoinmentRepository';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
  day: number;
}

type IResponse = Array<{
  hour: number;
  available: boolean;
}>;
@injectable()
class ListProviderDayAvailability {
  constructor(
    @inject('AppointmentRepository')
    private appointmentRepository: IAppointmentRepository,
  ) {}

  public async execute({
    provider_id,
    month,
    year,
    day,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentRepository.findAllDayInProvider({
      provider_id,
      month,
      year,
      day,
    });

    const hourStart = 8;
    const eachHourArray = Array.from(
      { length: 10 },
      (_, index) => index + hourStart,
    );
    const currentDate = new Date(Date.now());

    const availability = eachHourArray.map(hour => {
      const hasAppointmentInHour = appointments.find(
        appointment => getHours(appointment.date) === hour,
      );

      const comparedate = new Date(year, month - 1, day, hour);
      return {
        hour,
        available: !hasAppointmentInHour && isAfter(comparedate, currentDate),
      };
    });
    return availability;
  }
}

export default ListProviderDayAvailability;
