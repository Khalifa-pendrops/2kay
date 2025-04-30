import axios from "axios";
import config from "../config/config";
import {
  InitializePaymentArgs,
  VerifyPaymentResponse,
  CreateTransferRecipientArgs,
  TransferRecipientResponse,
  InitiateTransferArgs,
  TransferResponse,
  VerifyTransferResponse,
} from "../interfaces/paystack.interface";

class PaystackService {
  private readonly baseUrl: string;
  private readonly secretKey: string;
  private readonly publicKey: string;

  constructor() {
    this.baseUrl = config.PAYSTACK_BASE_URL;
    this.secretKey = config.PAYSTACK_SECRET_KEY;
    this.publicKey = config.PAYSTACK_PUBLIC_KEY;
  }

  private getHeaders() {
    return {
      Authorization: `Bearer ${this.secretKey}`,
      "Content-Type": "application/json",
    };
  }

  async initializePayment(args: InitializePaymentArgs): Promise<{
    authorization_url: string;
    access_code: string;
    reference: string;
  }> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/transaction/initialize`,
        args,
        { headers: this.getHeaders() }
      );

      return {
        authorization_url: response.data.data.authorization_url,
        access_code: response.data.data.access_code,
        reference: response.data.data.reference,
      };
    } catch (error: any) {
      throw new Error(
        `😞 Paystack initialization failed: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }

  async verifyPayment(reference: string): Promise<VerifyPaymentResponse> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/transaction/verify/${reference}`,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        `😞 Paystack verification failed: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }

  async createTransferRecipient(
    args: CreateTransferRecipientArgs
  ): Promise<TransferRecipientResponse> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/transferrecipient`,
        args,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        `😞 Paystack recipient creation failed: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }

  async initiateTransfer(
    args: InitiateTransferArgs
  ): Promise<TransferResponse> {
    try {
      const response = await axios.post(`${this.baseUrl}/transfer`, args, {
        headers: this.getHeaders(),
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        `😞 Paystack transfer initiation failed: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }

  async verifyTransfer(reference: string): Promise<VerifyTransferResponse> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/transfer/verify/${reference}`,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        `😞 Paystack transfer verification failed: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }
}

export default new PaystackService();
