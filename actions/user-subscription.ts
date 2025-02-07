'use server'

import { getUserSubscription } from '@/db/queries'
import { stripe } from '@/lib/stripe'
import { absoluteUrl } from '@/lib/utils'
import { auth, currentUser } from '@clerk/nextjs/server'

const returnUrl = absoluteUrl('/shop')

export const createStripeUrl = async () => {
  const { userId } = await auth()
  const user = await currentUser()

  if (!userId || !user) {
    throw new Error('Unauthorized')
  }

  const userSubscription = await getUserSubscription()

  if (userSubscription && userSubscription.stripeCustomerId) {
    const stripeSession = await stripe.billingPortal.sessions.create({
      customer: userSubscription.stripeCustomerId,
      return_url: returnUrl,
    })

    return { data: stripeSession.url }
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer_email: user.emailAddresses[0].emailAddress,
    success_url: returnUrl,
    cancel_url: returnUrl,
    payment_method_types: ['card'],
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'USD',
          product_data: {
            name: 'Lingo Pro',
            description: 'Unlimited Hearts',
          },
          unit_amount: 2000,
          recurring: {
            interval: 'month',
          },
        },
      },
    ],
    metadata: {
      userId,
    },
  })

  return { data: session.url }
}
