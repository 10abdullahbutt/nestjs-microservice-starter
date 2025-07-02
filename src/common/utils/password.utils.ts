import * as bcrypt from 'bcrypt';
import { isEmpty } from 'lodash';

export const PasswordUtils = {
  async compare(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  },

  async hash(password: string): Promise<string> {
    if (isEmpty(password) || password.length < 8) {
      throw new Error('Password must be at least 8 characters.');
    }
    return await bcrypt.hash(password, 10);
  },
};
