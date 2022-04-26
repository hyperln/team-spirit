import { SupportedMethods } from '@lib/api/api-types';
import { unsupportedMethodResponse } from '@lib/api/api-utils';
import { getUserProfile } from '@lib/db';
import {
  fetchCustomerByEmail,
  fetchSetupIntentstByCustomer,
  setupIntent,
} from '@lib/payments/server';
import { NextApiResponse, NextApiRequest } from 'next';

async function POST(req: NextApiRequest, res: NextApiResponse) {
  const user = await getUserProfile(req.body.userId);
  const customer = await fetchCustomerByEmail(user.email);
  const intents = await fetchSetupIntentstByCustomer(customer.id);
  if (intents.data.length > 0) {
    const intent = intents.data.find((i) => i.payment_method === null);
    res.status(200);
    res.json(intent);
  } else {
    const intent = await setupIntent(customer.id);
    res.status(200);
    res.json(intent);
  }
}

const METHODS = {
  POST,
};

export default async function intents(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const responder = METHODS[req.method]
    ? METHODS[req.method]
    : unsupportedMethodResponse([SupportedMethods.POST]);
  await responder(req, res);
}
