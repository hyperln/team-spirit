import Head from 'next/head';
import { AddPaymentMethodTemplate } from '@components/templates/add-payment-method-template';
import { withRequireAuth } from '@hoc/with-auth';

function AddPaymentMethodPage() {
  return (
    <>
      <Head>
        <title>Add payment method | Team Spirit</title>
      </Head>
      <AddPaymentMethodTemplate />
    </>
  );
}

export default withRequireAuth(AddPaymentMethodPage);
