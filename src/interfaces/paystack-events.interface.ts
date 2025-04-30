export interface PaystackWebhookEvent<T = any> {
  event: string;
  data: T;
}

export interface PaystackChargeSuccessData {
  id: number;
  domain: string;
  status: string;
  reference: string;
  amount: number;
  message: string | null;
  gateway_response: string;
  paid_at: string;
  created_at: string;
  channel: string;
  currency: string;
  ip_address: string;
  metadata: {
    bundleId: string;
    sponsorId: string;
    amount: number;
    [key: string]: any;
  };
  customer: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    customer_code: string;
    phone: string | null;
  };
  authorization: {
    authorization_code: string;
    bin: string;
    last4: string;
    exp_month: string;
    exp_year: string;
    channel: string;
    card_type: string;
    bank: string;
    country_code: string;
    brand: string;
    reusable: boolean;
    signature: string;
  };
}

export interface PaystackTransferData {
  domain: string;
  amount: number;
  currency: string;
  reference: string;
  source: string;
  source_details: null | any;
  reason: string;
  status: string;
  failures: null | any;
  transfer_code: string;
  titan_code: null | any;
  transferred_at: null | string;
  id: number;
  integration: {
    id: number;
    is_live: boolean;
    business_name: string;
  };
  recipient: {
    domain: string;
    type: string;
    currency: string;
    name: string;
    details: {
      authorization_code: null | any;
      account_number: string;
      account_name: string;
      bank_code: string;
      bank_name: string;
    };
    description: string;
    metadata: null | any;
    recipient_code: string;
    active: boolean;
    email: null | string;
    id: number;
    integration: number;
    created_at: string;
    updated_at: string;
  };
  session: {
    provider: null | any;
    id: null | any;
  };
  created_at: string;
  updated_at: string;
}
