import Head from 'next/head';
import { AddPaymentMethodTemplate } from '@components/templates/add-payment-method-template';

export default function AddPaymentMethodPage() {
  return (
    <>
      <Head>
        <title>Add payment method | Team Spirit</title>
      </Head>
      <AddPaymentMethodTemplate />
    </>
  );
}
