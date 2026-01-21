import bcrypt from "bcrypt";

export const passwordService = {
  hash: (plain: string) => bcrypt.hash(plain, 10),
  compare: (plain: string, hash: string) => bcrypt.compare(plain, hash),
};
