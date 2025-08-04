import { loadStripe } from '@stripe/stripe-js';

// Stripe publishable key from your backend implementation
const stripePromise = loadStripe('pk_test_51RHpukPso2ksGtbFHHYs3c0UzwsMg0e1hjW5Xv8r2B5cxUVN7qVbmSF27tr24yGn1WA41tmOBlHParBbAgCWkNDf00zm9gfoPw');

export default stripePromise; 