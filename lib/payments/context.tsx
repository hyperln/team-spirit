import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { ReactNode } from 'react';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK);

interface Props {
  children: ReactNode;
}

export function PaymentsContext({ children }: Props) {
  return <Elements stripe={stripePromise}>{children}</Elements>;
}
