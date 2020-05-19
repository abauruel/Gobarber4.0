import { hash, compare } from 'bcryptjs';
import IHasProvider from '../models/IHashProvider';

class BCrypthasProvider implements IHasProvider {
  async generateHash(payload: string): Promise<string> {
    return hash(payload, 8);
  }

  async compareHash(payload: string, hashed: string): Promise<boolean> {
    return compare(payload, hashed);
  }
}

export default BCrypthasProvider;
