
import { PlanType } from "../types";

/**
 * STRIPE SERVICE
 * This service handles the frontend integration with Stripe Checkout.
 * It expects VITE_STRIPE_PUBLISHABLE_KEY to be available in import.meta.env.
 */

// Safely access the Stripe Publishable Key to prevent "Cannot read properties of undefined" errors
// This occurs when the environment variables injected by Vite are not available in the current context.
const getStripeKey = (): string => {
  try {
    // @ts-ignore - Safely check for Vite's env object
    return (import.meta.env && import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) || "pk_test_placeholder";
  } catch (e) {
    return "pk_test_placeholder";
  }
};

const STRIPE_PK = getStripeKey();

export const createCheckoutSession = async (userId: string, plan: PlanType) => {
  console.log(`[Stripe] Creating checkout session for ${plan} using key: ${STRIPE_PK}...`);
  
  // In a production environment, you would call your backend here:
  /*
  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, plan })
  });
  const session = await response.json();
  const stripe = await loadStripe(STRIPE_PK);
  await stripe?.redirectToCheckout({ sessionId: session.id });
  */

  // For this demonstration, we simulate the redirect to a "Success" page.
  // This allows you to test the full flow without a backend.
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const successUrl = `${window.location.origin}${window.location.pathname}?checkout_success=true&plan=${plan}`;
  window.location.href = successUrl;
};
