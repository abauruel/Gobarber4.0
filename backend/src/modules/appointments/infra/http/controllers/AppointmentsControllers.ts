import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { parseISO } from 'date-fns';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

class AppointmentsController {
  async create(request: Request, response: Response): Promise<Response> {
    const { provider_id, date } = request.body;

    const parserDate = parseISO(date);
    const createAppointment = container.resolve(CreateAppointmentService);
    const appointments = await createAppointment.execute({
      provider_id,
      date: parserDate,
    });
    return response.json(appointments);
  }
}

export default AppointmentsController;
