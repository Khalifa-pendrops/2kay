export interface InitializePaymentArgs {
  email: string;
  amount: number;
  reference: string;
  callback_url?: string;
  metadata?: Record<string, any>;
}

export interface VerifyPaymentResponse {
  status: boolean;
  message: string;
  data: {
    amount: number;
    reference: string;
    status: "success" | "failed" | "abandoned";
    metadata: Record<string, any>;
  };
}

export interface CreateTransferRecipientArgs {
  type: "nuban";
  name: string;
  account_number: string;
  bank_code: string;
  currency?: string;
  description?: string;
}

export interface TransferRecipientResponse {
  status: boolean;
  message: string;
  data: {
    recipient_code: string;
  };
}

export interface InitiateTransferArgs {
  source: "balance";
  amount: number;
  recipient: string; // should be recipient code
  reason: string;
  reference?: string;
}

export interface TransferResponse {
  status: boolean;
  message: string;
  data: {
    transfer_code: string;
    reference: string;
  };
}

export interface VerifyTransferResponse {
  status: boolean;
  message: string;
  data: {
    status: "otp" | "pending" | "success" | "failed";
  };
}
