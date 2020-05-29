import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

class AppointmentsController {
  async create(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { provider_id, date } = request.body;

    const createAppointment = container.resolve(CreateAppointmentService);
    const appointments = await createAppointment.execute({
      user_id,
      provider_id,
      date,
    });
    return response.json(appointments);
  }
}

export default AppointmentsController;
