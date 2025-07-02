import CryptoJS from 'crypto-js';

const genrateToken = (id: any, secret: string) => {
  const data = {
    userId: id,
    createdAt: new Date(),
  };

  const dataString = JSON.stringify(data);

  const encryptedData = CryptoJS.HmacSHA1(dataString, secret).toString();
  const token = encryptedData.toString();
  return token;
};

export const decrypt = (dataString: string, secret: string) => {
  const encryptedData = CryptoJS.AES.decrypt(dataString, secret);

  return JSON.parse(encryptedData.toString());
};

export { genrateToken };
