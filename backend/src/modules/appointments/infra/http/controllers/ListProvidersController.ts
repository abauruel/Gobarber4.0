import ListProviderService from '@modules/appointments/services/ListProvideServicer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

class ListProvidersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const listProviders = container.resolve(ListProviderService);

    const providers = await listProviders.execute({ user_id });

    return response.json(providers);
  }
}

export default ListProvidersController;
