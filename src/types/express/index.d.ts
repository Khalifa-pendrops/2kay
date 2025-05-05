import { IUser } from "../../interfaces/user.interfaces";

declare global {
  namespace Express {
    interface Request {
      file?: File;
      files?: File[];
      user: {
        id: string;
        role: string;
      } & Partial<IUser>;
    }
  }
}
