import Bill from "../models/bill.model";
import { IBill } from "../interfaces/bill.interface";


export const createBill = async (
  serviceProvider: string,
  amount: number,
  dueDate: Date,
  referenceNumber: string,
  description?: string
): Promise<IBill> => {
  const bill = new Bill({
    serviceProvider,
    amount,
    dueDate,
    referenceNumber,
    description,
  });

  await bill.save();
  return bill;
};

export const getBillsByOwner = async (ownerId: string): Promise<IBill[]> => {
  return Bill.find({ serviceProvider: ownerId });
};

export const updateBillStatus = async (
  billId: string,
  status: string
): Promise<IBill | null> => {
  return Bill.findByIdAndUpdate(billId, { status }, { new: true });
};
