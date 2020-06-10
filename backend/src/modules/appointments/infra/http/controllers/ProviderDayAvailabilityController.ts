import ProviderDayAvailability from '@modules/appointments/services/ListProviderDayAvailabilityService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

class ProviderDayAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params;
    const { month, year, day } = request.query;
    const providerDayAvailability = container.resolve(ProviderDayAvailability);

    const availability = await providerDayAvailability.execute({
      month: Number(month),
      day: Number(day),
      year: Number(year),
      provider_id,
    });

    return response.json(availability);
  }
}

export default ProviderDayAvailabilityController;
