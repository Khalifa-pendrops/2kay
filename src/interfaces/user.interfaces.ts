import { Document } from "mongoose";

export enum UserRole {
  BILL_OWNER = "bill_owner",
  BILL_SPONSOR = "bill_sponsor",
  SERVICE_PROVIDER = "service_provider",
  EXPENSE_MANAGER = "expense_manager",
}

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  role?: UserRole;
  isVerified: boolean;
  // bankAccountName?: string;
  bankAccountNumber?: string;
  bankCode?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}
