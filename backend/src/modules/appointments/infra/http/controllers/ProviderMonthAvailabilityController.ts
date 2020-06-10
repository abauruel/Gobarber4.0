import ProviderMonthAvailability from '@modules/appointments/services/ListProviderMonthAvailabilityService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

class ProviderMonthAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params;
    const { month, year } = request.query;
    const providerMonthAvailability = container.resolve(
      ProviderMonthAvailability,
    );

    const availability = await providerMonthAvailability.execute({
      month: Number(month),
      year: Number(year),
      provider_id,
    });

    return response.json(availability);
  }
}

export default ProviderMonthAvailabilityController;
