import { PaymentIntentStatusPageTemplate } from '@components/templates/payment-intent-status-page-template';
import Head from 'next/head';

export default function PaymentStatusPage() {
  return (
    <>
      <Head>
        <title>Payment method status page | Team Spirit</title>
        <PaymentIntentStatusPageTemplate />
      </Head>
    </>
  );
}
