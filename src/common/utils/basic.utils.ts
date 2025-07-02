import argon2 from 'argon2';
import crypto from 'crypto';
import dayjs from 'dayjs';
import { nanoid, urlAlphabet } from 'nanoid';
import { customAlphabet } from 'nanoid/non-secure';
import { IPaginated } from '../interface/interface';

export const capitalize = (...words: string[]) => {
  words.forEach((word, index) => {
    words[index] = word ? word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase() : '';
  });
  return words.join(' ');
};

export const getHashedPassword = async (password: string) => {
  return await argon2.hash(password);
};

export const generateRandomPassword = (length = 8) => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
};

export const matchPassword = async (hashPassword: string, password: string) => {
  return await argon2.verify(hashPassword, password);
};

export const roundUptoTwoDecimals = (num: number) => {
  return parseFloat(parseFloat(String(num)).toFixed(2));
};

export const getNanoId = () => {
  return nanoid();
};

export const getCustomSizeNanoId = (size: number) => {
  return customAlphabet(urlAlphabet, size)();
};

export const getNumericNanoId = (size: number) => {
  return customAlphabet('0123456789', size)();
};

export const getUUIDV4 = () => {
  return crypto.randomUUID();
};

export const getUserId = (prefix: string) => {
  return prefix + getNumericNanoId(8);
};

export const getOrderId = () => {
  return customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 3)() + getNumericNanoId(7);
};

export const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const getTokenExpiryDate = () => {
  //const expiryTimeInMs = ms(accessTokenConfig.signOptions.expiresIn);
  //   const expiresAt = new Date(Date.now() + expiryTimeInMs);
  //   return expiresAt;
};

export const clc = {
  green: (text: string) => `\x1B[32m${text}\x1B[39m`,
  yellow: (text: string) => `\x1B[33m${text}\x1B[39m`,
  red: (text: string) => `\x1B[31m${text}\x1B[39m`,
  magentaBright: (text: string) => `\x1B[95m${text}\x1B[39m`,
  cyanBright: (text: string) => `\x1B[96m${text}\x1B[39m`,
};

export const getColorByStatusCode = (statusCode: number) => {
  switch (true) {
    case statusCode < 300:
      return clc.green;
    case statusCode < 400:
      return clc.yellow;
    case statusCode < 600:
      return clc.red;
    default:
      return clc.cyanBright;
  }
};

export const escapeRegExp = (str: string) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export const getSearchQueryFilters = (searchKeyword: string, searchFilters: string[]) => {
  const filters: any[] = [];
  const regexSearchExpr: any = {
    $regex: escapeRegExp(searchKeyword),
    $options: 'i',
  };
  searchFilters.forEach((searchFilter: string) => {
    filters.push({ [searchFilter]: regexSearchExpr });
  });
  return filters;
};

export const formatDate = (date?: string | Date, format?: string) => {
  let formatStr = 'D MMM YYYY h:mm A';
  if (format) formatStr = format;
  if (date) return dayjs(date).format(formatStr);
  return dayjs().format(formatStr);
};

export const encryptData = (text: string, encryptionKey: string): string => {
  const cipher = crypto.createCipher('aes-256-cbc', encryptionKey);
  let encryptedData = cipher.update(text, 'utf8', 'hex');
  encryptedData += cipher.final('hex');
  return encryptedData;
};

export const decryptData = (encryptedData: string, encryptionKey: string): string => {
  const decipher = crypto.createDecipher('aes-256-cbc', encryptionKey);
  let decryptedData = decipher.update(encryptedData, 'hex', 'utf8');
  decryptedData += decipher.final('utf8');
  return decryptedData;
};

export const getPaginationParams = (args: IPaginated) => ({
  page: +(args?.page ?? 1),
  skip: +((args?.page ?? 1) - 1) * (args?.limit ?? 10),
  limit: args?.limit ?? 10,
});
