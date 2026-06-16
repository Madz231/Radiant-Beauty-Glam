// Simple mock payment processor
// In production, replace with Stripe, PayPal, etc.

export async function processPayment(cardData) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const { cardNumber, expiryDate, cvv, cardholderName } = cardData;

  // Validation
  if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
    throw new Error('All payment fields are required');
  }

  // Basic card number validation (Luhn algorithm simulation)
  if (cardNumber.length !== 16 || !/^\d+$/.test(cardNumber)) {
    throw new Error('Invalid card number. Please enter 16 digits.');
  }

  // Expiry date validation
  const [month, year] = expiryDate.split('/');
  if (!month || !year || month < 1 || month > 12 || year.length !== 2) {
    throw new Error('Invalid expiry date. Use MM/YY format.');
  }

  // CVV validation
  if (!/^\d{3,4}$/.test(cvv)) {
    throw new Error('Invalid CVV. Use 3-4 digits.');
  }

  // Simulate occasional failures for testing (10% chance)
  if (Math.random() < 0.1) {
    throw new Error('Payment declined. Please try again.');
  }

  // Success
  return {
    success: true,
    transactionId: `TXN-${Date.now()}`,
    timestamp: new Date().toISOString(),
    amount: 0, // Amount will be passed separately
    cardLast4: cardNumber.slice(-4)
  };
}
