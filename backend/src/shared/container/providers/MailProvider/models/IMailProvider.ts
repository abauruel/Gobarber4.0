import ISendmailDTO from '../dtos/ISendEmailDTO';

export default interface IMailProvider {
  sendEmail(data: ISendmailDTO): Promise<void>;
}
