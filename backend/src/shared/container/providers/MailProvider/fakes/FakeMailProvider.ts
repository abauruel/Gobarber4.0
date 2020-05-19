import IMailProvider from '../models/IMailProvider';

class FakeMailProvider implements IMailProvider {
  public async sendEmail(to: string, body: string): Promise<void> {
    const mail = { to, body };
  }
}
export default FakeMailProvider;
