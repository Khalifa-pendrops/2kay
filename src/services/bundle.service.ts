import Bundle from "../models/bundle.model";
import Bill from "../models/bill.model";
import User from "../models/user.model";
import { generateUniqueLink } from "../utils/generateUniqueLink";
import { BundleStatus, IBundle } from "../interfaces/bundle.interface";


export const createBundle = async (
  ownerId: string,
  billIds: string[],
  sponsorEmails: string[]
): Promise<IBundle> => {
  // Verify that all bills exist and belong to the owner
  const bills = await Bill.find({ _id: { $in: billIds } });

  if (bills.length !== billIds.length) {
    throw new Error("One or more bills not found 😞");
  }

  // Calculate the total amount in the bundle
  const totalAmount = bills.reduce((sum, bill) => sum + bill.amount, 0);

  // Generate the unique link
  const uniqueLink = generateUniqueLink();

  // then find sponsors by email
  const sponsors = await User.find({ email: { $in: sponsorEmails } });

  if (sponsors.length !== sponsorEmails.length) {
    throw new Error("One or more sponsors not found 😞");
  }

  // Prepare a sponsor's contributions
  const sponsorContributions = sponsors.map((sponsor) => ({
    user: sponsor._id,
    amount: 0, 
    status: "pending",
  }));

  // Create the bundle now
  const bundle = new Bundle({
    owner: ownerId,
    bills: billIds,
    sponsors: sponsorContributions,
    uniqueLink,
    totalAmount,
    amountFunded: 0,
  });

  await bundle.save();

  // Populate the bundle to return full details as is in IBundle
  const populatedBundle = await Bundle.findById(bundle._id)
    .populate("owner", "firstName lastName email")
    .populate("bills")
    .populate("sponsors.user", "firstName lastName email");

  return populatedBundle as IBundle;
};

export const getBundleByLink = async (uniqueLink: string): Promise<IBundle> => {
  const bundle = await Bundle.findOne({ uniqueLink })
    .populate("owner", "firstName lastName email")
    .populate("bills")
    .populate("sponsors.user", "firstName lastName email");

  if (!bundle) {
    throw new Error("Bundle not found 😞");
  }

  return bundle as IBundle;
};

export const sponsorContribution = async (
  bundleId: string,
  sponsorId: string,
  amount: number
): Promise<IBundle> => {
  const bundle = await Bundle.findById(bundleId);

  if (!bundle) {
    throw new Error("Bundle not found 😞");
  }

  // Find the sponsor in the bundle
  const sponsorIndex = bundle.sponsors.findIndex(
    (s) => s.user.toString() === sponsorId
  );

  if (sponsorIndex === -1) {
    throw new Error("You are not authorized to contribute to this bundle 😞");
  }

  // Update sponsor contribution
  const sponsor = bundle.sponsors[sponsorIndex];
  const previousAmount = sponsor.amount;
  sponsor.amount = amount;
  sponsor.status = "paid";

  // Update bundle's funded amount
  bundle.amountFunded = bundle.amountFunded - previousAmount + amount;

  // Check if bundle is fully funded
  if (bundle.amountFunded >= bundle.totalAmount) {
    bundle.status = BundleStatus.FULLY_FUNDED;
  } else if (bundle.amountFunded > 0) {
    bundle.status = BundleStatus.PARTIALLY_FUNDED;
  }

  await bundle.save();

  // Populate the bundle to return full details
  const populatedBundle = await Bundle.findById(bundle._id)
    .populate("owner", "firstName lastName email")
    .populate("bills")
    .populate("sponsors.user", "firstName lastName email");

  return populatedBundle as IBundle;
};

export const processBundle = async (bundleId: string): Promise<IBundle> => {
  const bundle = await Bundle.findById(bundleId).populate("bills");

  if (!bundle) {
    throw new Error("Bundle not found 😞");
  }

  if (bundle.status !== "fully_funded") {
    throw new Error("Bundle is not fully funded yet 🔴");
  }

  // Update all bills in the bundle to paid status
  await Bill.updateMany({ _id: { $in: bundle.bills } }, { status: "paid" });

  // Update bundle status to processed
  bundle.status = BundleStatus.PROCESSED;
  await bundle.save();

  return bundle as IBundle;
};

export const getUserBundles = async (userId: string): Promise<IBundle[]> => {
  return Bundle.find({ $or: [{ owner: userId }, { "sponsors.user": userId }] })
    .populate("owner", "firstName lastName email")
    .populate("bills")
    .populate("sponsors.user", "firstName lastName email");
};
