import { Request, Response } from 'express';
import { container } from 'tsyringe';
import UpdateUserService from '@modules/users/services/UpdateUserservice';

class UserAvatarController {
  async update(request: Request, response: Response): Promise<Response> {
    const updateRepository = container.resolve(UpdateUserService);
    const user = await updateRepository.execute({
      user_id: request.user.id,
      avatarfilename: request.file.filename,
    });
    delete user.password;
    return response.json(user);
  }
}

export default UserAvatarController;
