import IMailProvider from '../models/IMailProvider';
import ISendmailDTO from '../dtos/ISendEmailDTO';

class FakeMailProvider implements IMailProvider {
  private messages: ISendmailDTO[] = [];

  public async sendEmail(messages: ISendmailDTO): Promise<void> {
    this.messages.push(messages);
  }
}
export default FakeMailProvider;
