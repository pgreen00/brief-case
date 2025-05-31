import { expose } from 'threads/worker';
import Encryptor from '../../../infrastructure/encryptor/encryptor.js';

type UserInfo = {
  email: Buffer
  first_name: Buffer | null
  last_name: Buffer | null
  middle_name: Buffer | null
  phone: Buffer | null
  iv: Buffer
}

const decryptWorker = {
  async decryptUserInfo(userInfo: UserInfo, dek: Buffer) {
    await using encryptor = new Encryptor(dek);
    return {
      email: await encryptor.decrypt(userInfo.email, userInfo.iv),
      first_name: userInfo.first_name ? await encryptor.decrypt(userInfo.first_name, userInfo.iv) : null,
      last_name: userInfo.last_name ? await encryptor.decrypt(userInfo.last_name, userInfo.iv) : null,
      middle_name: userInfo.middle_name ? await encryptor.decrypt(userInfo.middle_name, userInfo.iv) : null,
      phone: userInfo.phone ? await encryptor.decrypt(userInfo.phone, userInfo.iv) : null,
    };
  }
};

export type DecryptWorker = typeof decryptWorker;
expose(decryptWorker);
