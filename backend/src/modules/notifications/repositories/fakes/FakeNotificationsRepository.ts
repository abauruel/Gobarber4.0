import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';
import { ObjectID } from 'mongodb';
import INotificationRepository from '../INotificationRepository';
import Notification from '../../infra/typeorm/schemas/Notification';

class FakeNotificationsRepository implements INotificationRepository {
  private notification: Notification[] = [];

  public async create({
    recipient_id,
    content,
  }: ICreateNotificationDTO): Promise<Notification> {
    const notification = new Notification();
    Object.assign(notification, { id: new ObjectID(), recipient_id, content });
    this.notification.push(notification);

    return notification;
  }
}

export default FakeNotificationsRepository;
