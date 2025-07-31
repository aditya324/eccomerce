/**
 * Defines the options object passed to the Razorpay constructor.
 */
export interface RazorpayOptions {
  key: string;
  subscription_id?: string;
  order_id?: string;
  amount?: number;
  currency?: string;
  name: string;
  description: string;
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_subscription_id?: string;
    razorpay_order_id?: string;
    razorpay_signature: string;
  }) => void | Promise<void>;
  theme?: {
    color: string;
  };
}

/**
 * Represents the instance returned by `new Razorpay(options)`.
 */
export interface RazorpayInstance {
  /** Opens the Razorpay checkout modal. */
  open(): void;
  /**
   * Subscribes to events, such as payment failure.
   * @param event - The event name, e.g., 'payment.failed'.
   * @param callback - The function to execute when the event occurs.
   */
  on(event: 'payment.failed', callback: (response: RazorpayPaymentErrorResponse) => void): void;
  /** Closes the Razorpay checkout modal. */
  close(): void;
}

// --- Response Types ---

/**
 * The object passed to the `handler` function on successful payment.
 */
export interface RazorpayPaymentSuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

/**
 * The object passed to the 'payment.failed' event callback.
 */
export interface RazorpayPaymentErrorResponse {
  code: string;
  description: string;
  source: string;
  step: string;
  reason: string;
  metadata: {
    order_id: string;
    payment_id: string;
  };
}