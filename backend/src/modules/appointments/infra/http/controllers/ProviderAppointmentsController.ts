import { Request, Response } from 'express';
import ListProviderAppointmentService from '@modules/appointments/services/ListProviderAppointmentService';
import { container } from 'tsyringe';

class ProviderAppointmentsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const provider_id = request.user.id;
    const { day, month, year } = request.query;

    const listProviderappointmentService = container.resolve(
      ListProviderAppointmentService,
    );

    const appointments = await listProviderappointmentService.execute({
      provider_id,
      day: Number(day),
      month: Number(month),
      year: Number(year),
    });
    return response.json(appointments);
  }
}

export default ProviderAppointmentsController;
