import Stripe from 'stripe';

export type PaymentIntentParams = Pick<
  Stripe.PaymentIntentCreateParams,
  'customer' | 'description'
>;

export type PaymentMethodCard = {
  brand: string;
  checks?: {
    address_line1_check: any;
    address_postal_code_check: any;
    cvc_check: any;
  };
  country: string;
  exp_month: number;
  exp_year: number;
  funding: string;
  generated_from?: any;
  last4: string;
  three_d_secure_usage: {
    supported: boolean;
  };
  wallet?: any;
};

export type PaymentMethod = {
  billing_details: {
    address: {
      city: string;
      country: string;
      line1: string;
      line2: string;
      postal_code: string;
      state: string;
    };
    email: string;
    name: string;
    phone: any;
  };
  card: PaymentMethodCard;
  created: number;
  customer: any;
  id: string;
  livemode: boolean;
  object: string;
  type: string;
};

export type PaymentIntent = {
  amount: number;
  amount_capturable: number;
  amount_received: number;
  application?: any;
  application_fee_amount?: any;
  canceled_at?: any;
  cancellation_reason?: any;
  capture_method: string;
  charges: {
    object: string;
    data: any;
    has_more: boolean;
    total_count: number;
    url: string;
  };
  client_secret: string;
  confirmation_method: string;
  created: number;
  currency: string;
  customer?: any;
  description?: any;
  id: string;
  invoice?: any;
  last_payment_error?: any;
  livemode: boolean;
  metadata: any;
  next_action?: any;
  object: string;
  on_behalf_of?: any;
  payment_method?: any;
  payment_method_options: { card: any };
  payment_method_types: string[];
  receipt_email?: any;
  review?: any;
  setup_future_usage?: any;
  shipping?: any;
  source?: any;
  statement_descriptor?: any;
  statement_descriptor_suffix?: any;
  status: string;
  transfer_data?: any;
  transfer_group?: any;
};

export interface Address {
  id?: number;
  lastName: string;
  firstName: string;
  company?: string;
  email?: string;
  phone?: string;
  city: string;
  countryCode: string;
  stateOrProvince: string;
  address1: string;
  address2?: string;
  postalCode: string;
}

export interface ShippingAddress extends Address {
  email: string;
  stateOrProvinceCode?: string;
  country: string;
  customFields?: any[];
}

export type CreatePaymentIntentParams = {
  paymentIntentParams: PaymentIntentParams;
  checkoutId: string;
  customerId?: string;
  bigCommerceCustomerId?: number;
  billingAddress: ShippingAddress;
};

export type SavedPaymentMethodDataBillingDetails = {
  address: {
    city: string;
    country: string;
    line1: string;
    line2: string;
    postal_code: string;
    state: string;
  };
  email: string;
  name: string;
  phone?: any;
};

export type SavedPaymentMethodDataCard = {
  brand: string;
  checks: {
    address_line1_check: string;
    address_postal_code_check: string;
    cvc_check: string;
  };
  country: string;
  exp_month: number;
  exp_year: number;
  fingerprint: string;
  funding: string;
  generated_from?: any;
  last4: string;
  networks: {
    available: string[];
    preferred?: any;
  };
  three_d_secure_usage: { supported: boolean };
  wallet?: any;
};

export type SavedCard = {
  brand: string;
  country: string;
  exp_month: number;
  exp_year: number;
  last4: string;
  networks: {
    available: string[];
  };
};

export type SavedPaymentMethod = {
  id: string;
  billing_details: SavedPaymentMethodDataBillingDetails;
  card: SavedCard;
  created: number;
  customer: string;
  type: string;
};

export type SavedPaymentMethodDataRaw = {
  id: string;
  object: string;
  billing_details: SavedPaymentMethodDataBillingDetails;
  card: SavedPaymentMethodDataCard;
  created: number;
  customer: string;
  livemode: boolean;
  metadata: any;
  type: string;
};

export type SavedPaymentMethodResponse = {
  object: string;
  data: SavedPaymentMethodDataRaw[];
  has_more: boolean;
  url: string;
};

export type SetDefaultPaymentMethodParams = {
  customerId: string;
  paymentMethodId: string;
};

export namespace Payments {
  export interface Event extends Stripe.Event {
    data: Payments.Event.Data;
  }

  export interface InvoiceEvent extends Stripe.Event {
    data: Payments.InvoiceEvent.Data;
  }

  export namespace InvoiceEvent {
    export interface Data extends Stripe.Event.Data {
      object: Payments.InvoiceEvent.Data.Object;
    }

    export namespace Data {
      export interface Object extends Stripe.Event.Data.Object {
        id: string;
        object: string;
        account_country: string;
        account_name: string;
        account_tax_ids?: any;
        amount_due: number;
        amount_paid: number;
        amount_remaining: number;
        application_fee_amount?: number;
        attempt_count: number;
        attempted: boolean;
        billing_reason: string;
        charge?: any;
        collection_method: string;
        created: number;
        currency: string;
        custom_fields?: any;
        customer: string;
        customer_address: {
          city: string;
          country: string;
          line1: string;
          line2?: any;
          postal_code: string;
          state: string;
        };
        customer_email: string;
        customer_name: string;
        customer_phone?: any;
        customer_shipping?: any;
        customer_tax_exempt: string;
        customer_tax_ids: any[];
        default_payment_method?: any;
        default_source?: any;
        default_tax_rates: any[];
        description?: any;
        discount?: any;
        discounts: any[];
        due_date?: any;
        ending_balance: number;
        footer?: any;
        last_finalization_error?: any;
        lines: {
          object: string;
          data: {
            id: string;
            object: string;
            amount: number;
            currency: string;
            description: string;
            discount_amounts: any[];
            discountable: boolean;
            discounts: any[];
            livemode: boolean;
            metadata: { [key: string]: any };
            period: {
              end: number;
              start: number;
            };
            plan: {
              id: string;
              object: string;
              active: boolean;
              aggregate_usage?: any;
              amount: number;
              amount_decimal: string;
              billing_scheme: string;
              created: number;
              currency: string;
              interval: string;
              interval_count: number;
              livemode: boolean;
              metadata: { [key: string]: any };
              nickname?: any;
              product: string;
              tiers_mode?: any;
              transform_usage?: any;
              trial_period_days?: any;
              usage_type: string;
            };
            price: {
              id: string;
              object: string;
              active: boolean;
              billing_scheme: string;
              created: number;
              currency: string;
              livemode: boolean;
              lookup_key?: any;
              metadata: { [key: string]: any };
              nickname?: any;
              product: string;
              recurring: {
                aggregate_usage?: any;
                interval: string;
                interval_count: number;
                trial_period_days?: any;
                usage_type: string;
              };
              tiers_mode?: any;
              transform_quantity?: any;
              type: string;
              unit_amount: number;
              unit_amount_decimal: string;
            };
            proration: boolean;
            quantity: 1;
            subscription: string;
            subscription_item: string;
            tax_amounts: any[];
            tax_rates: any[];
            type: string;
          }[];
          has_more: boolean;
          total_count: number;
          url: string;
        };
        livemode: boolean;
        metadata: { [key: string]: any };
        next_payment_attempt: number;
        number?: any;
        on_behalf_of?: any;
        paid: boolean;
        payment_intent?: any;
        payment_settings: {
          payment_method_options?: any;
          payment_method_types?: any;
        };
        period_end: number;
        period_start: number;
        post_payment_credit_notes_amount: number;
        pre_payment_credit_notes_amount: number;
        receipt_number?: any;
        starting_balance: number;
        statement_descriptor?: any;
        status: string;
        status_transitions: {
          finalized_at?: any;
          marked_uncollectible_at?: any;
          paid_at?: any;
          voided_at?: any;
        };
        subscription: string;
        subtotal: number;
        tax?: any;
        total: number;
        total_discount_amounts: any[];
        total_tax_amounts: any[];
        transfer_data?: any;
        webhooks_delivered_at?: any;
      }
    }
  }

  export namespace Event {
    export interface Data extends Stripe.Event.Data {
      object: Payments.Event.Data.Object;
    }

    export namespace Data {
      export interface Object extends Stripe.Event.Data.Object {
        id: string;
        object: string;
        amount: number;
        amount_captured: number;
        amount_refunded: number;
        application?: any;
        application_fee?: any;
        application_fee_amount?: any;
        balance_transaction: string;
        billing_details: {
          address: {
            city: string;
            country: string;
            line1: string;
            line2: string;
            postal_code: string;
            state: string;
          };
          email: string;
          name: string;
          phone?: any;
        };
        calculated_statement_descriptor: string;
        captured: boolean;
        created: number;
        currency: string;
        customer: string;
        description: string;
        destination?: any;
        dispute?: any;
        disputed: boolean;
        failure_code?: any;
        failure_message?: any;
        fraud_details: { [key: string]: any };
        invoice?: any;
        livemode: boolean;
        metadata: { [key: string]: any };
        on_behalf_of?: any;
        order?: any;
        outcome: {
          network_status: string;
          reason?: any;
          risk_level: string;
          risk_score: number;
          seller_message: string;
          type: string;
        };
        paid: boolean;
        payment_intent: string;
        payment_method: string;
        payment_method_details: {
          card: {
            brand: string;
            checks: any;
            country: string;
            exp_month: number;
            exp_year: number;
            fingerprint: string;
            funding: string;
            installments?: any;
            last4: string;
            network: string;
            three_d_secure?: any;
            wallet?: any;
          };
          type: string;
        };
        receipt_email?: any;
        receipt_number?: any;
        receipt_url: string;
        refunded: boolean;
        refunds: {
          object: string;
          data: any[];
          has_more: boolean;
          total_count: number;
          url: string;
        };
        review?: any;
        shipping?: any;
        source?: any;
        source_transfer?: any;
        statement_descriptor?: any;
        statement_descriptor_suffix?: any;
        status: string;
        transfer_data?: any;
        transfer_group?: any;
      }
    }
  }
}
