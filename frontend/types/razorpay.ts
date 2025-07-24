/**
 * Defines the options object passed to the Razorpay constructor.
 */
export interface RazorpayOptions {
  /** Your public Razorpay key. */
  key: string;
  /** The transaction amount, in the smallest currency unit (e.g., paise for INR). */
  amount: number | string;
  /** The currency for the transaction (e.g., "INR"). */
  currency: string;
  /** Your business or product name. */
  name: string;
  /** A brief description of the transaction. */
  description?: string;
  /** A URL for your business logo. */
  image?: string;
  /** The unique ID for the order created on your server. */
  order_id: string;
  /**
   * The callback function that executes upon successful payment.
   * @param response - The successful payment details.
   */
  handler?: (response: RazorpayPaymentSuccessResponse) => void;
  /** Pre-fills customer details on the checkout form. */
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  /** Custom notes for the transaction. */
  notes?: Record<string, string>;
  /** Customizes the appearance of the checkout modal. */
  theme?: {
    color?: string;
  };
  /** The function to call when the checkout modal is dismissed. */
  modal?: {
    ondismiss?: () => void;
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