import { PaymentMethodsTemplate } from '@components/templates/payment-methods-template';
import Head from 'next/head';

export default function PaymentMethodsPage() {
  return (
    <>
      <Head>
        <title>Payment methods | Team Spirit</title>
      </Head>
      <PaymentMethodsTemplate />
    </>
  );
}
