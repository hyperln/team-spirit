import Stripe from 'stripe';
import { CreatePaymentIntentParams, PaymentMethod } from './payment-types';

const { STRIPE_SK } = process.env;

function getStripe() {
  const stripe = new Stripe(STRIPE_SK, { apiVersion: null });
  return stripe;
}

export async function fetchSetupIntentstByCustomer(customerId: string) {
  const stripe = getStripe();
  const intents = await stripe.paymentIntents.list({
    customer: customerId,
  });
  return intents;
}

export async function setupIntent(customerId: string) {
  const stripe = getStripe();
  const intent = await stripe.setupIntents.create({
    customer: customerId,
    payment_method_types: ['card'],
  });
  return intent;
}

export async function createPaymentIntent(
  params: Stripe.PaymentIntentCreateParams,
) {
  const stripe = getStripe();
  const paymentIntent = await stripe.paymentIntents.create(params);
  return paymentIntent;
}

export async function listCustomersPaymentMethods(
  customerId: string,
): Promise<PaymentMethod[]> {
  const stripe = getStripe();
  const paymentMethods = await stripe.paymentMethods.list({
    customer: customerId,
    type: 'card',
  });
  return paymentMethods.data as PaymentMethod[];
}

export async function createCustomer(
  billingAddress: CreatePaymentIntentParams['billingAddress'],
) {
  const stripe = getStripe();
  try {
    const customer = await stripe.customers.create({
      email: billingAddress.email,
      name: `${billingAddress.firstName} ${billingAddress.lastName}`,
      address: {
        line1: billingAddress.address1,
        line2: billingAddress.address2,
        city: billingAddress.city,
        country: billingAddress.country,
        postal_code: billingAddress.postalCode,
        state: billingAddress.stateOrProvince,
      },
    });
    return customer;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function registerWebhooks() {
  const stripe = getStripe();
  await stripe.webhookEndpoints.create({
    url: `${process.env.WEBHOOKS_PATH}/payments`,
    enabled_events: [
      'charge.captured',
      'charge.failed',
      'charge.succeeded',
      'charge.refunded',
      'charge.updated',
      'payment_intent.canceled',
      'review.closed',
      'invoice.created',
      'invoice.paid',
      'invoice.upcoming',
    ],
  });
  return 'Success';
}

export function verifyWebhookSig(
  requestBody: string | Buffer,
  signature: string,
) {
  try {
    const stripe = getStripe();
    return stripe.webhooks.constructEvent(
      requestBody,
      signature,
      process.env.STRIPE_WEBHOOK_SIGNING_SECRET,
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function serverUpdateInvoiceMetadata(
  id: string,
  metadata: { [key: string]: string },
) {
  try {
    const stripe = getStripe();
    return stripe.invoices.update(id, {
      metadata,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function serverFetchInvoice(id: string) {
  try {
    const stripe = getStripe();
    return stripe.invoices.retrieve(id);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function fetchCustomerByEmail(email: string) {
  try {
    const customers = await getStripe().customers.list({ email });
    const customer = customers.data[0];
    return customer;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
