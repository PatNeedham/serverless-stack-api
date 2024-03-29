import stripePackage from 'stripe';
import { calculateCost } from './libs/billing-lib';
import { success, failure } from './libs/response-lib';

export async function main(event, context) {
  const { storage, source } = JSON.parse(event.body);
  const amount = calculateCost(storage);
  const description = 'Scratch charge';
  const stripe = stripePackage(process.env.stripeSecretKey);
  try {
    await stripe.charges.create({
      source,
      amount,
      description,
      currency: 'usd',
    });
    return success({ status: true });
  } catch (e) {
    console.log('error:');
    console.dir(e);
    return failure({ message: e.message });
  }
};
