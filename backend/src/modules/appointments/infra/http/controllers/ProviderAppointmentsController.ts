import { Request, Response } from 'express';
import ListProviderAppointmentService from '@modules/appointments/services/ListProviderAppointmentService';
import { container } from 'tsyringe';

class ProviderAppointmentsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const provider_id = request.user.id;
    const { day, month, year } = request.body;

    const listProviderappointmentService = container.resolve(
      ListProviderAppointmentService,
    );
    console.log(provider_id, day, month, year);
    const appointments = await listProviderappointmentService.execute({
      provider_id,
      day,
      month,
      year,
    });
    return response.json(appointments);
  }
}

export default ProviderAppointmentsController;
