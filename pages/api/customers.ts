import { SupportedMethods } from '@lib/api/api-types';
import { unsupportedMethodResponse } from '@lib/api/api-utils';
import { createCustomer, fetchCustomerByEmail } from '@lib/payments/server';
import { NextApiResponse, NextApiRequest } from 'next';

async function POST(req: NextApiRequest, res: NextApiResponse) {
  const billingAddress = req.body;
  const customer = await createCustomer(billingAddress);
  res.status(200);
  res.json(customer);
}

async function GET(req: NextApiRequest, res: NextApiResponse) {
  const customer = await fetchCustomerByEmail(req.query.email as string);
  res.status(200);
  res.json(customer);
}

const METHODS = {
  POST,
  GET,
};

export default async function customers(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const responder = METHODS[req.method]
    ? METHODS[req.method]
    : unsupportedMethodResponse([SupportedMethods.POST]);
  await responder(req, res);
}
