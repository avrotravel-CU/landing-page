export type Booking = {
  name: string;
  quotation: string;
  email: string;
  phone: string;
  amount: string;
  currency: string;
  arrivalDate?: string;
  daysTillArrival?: number | null;
  totalPaid?: number;
  amountOwed?: number;
  milestoneId?: string;
  paymentAmount?: string;
};

export type CardDetails = {
  method: string;
  name: string;
  number: string;
  month: string;
  year: string;
  cvc: string;
  last4?: string;
};

export type PaymentResultState = {
  booking: Booking;
  card: CardDetails;
  transactionRef: string;
  stripePaymentIntentId?: string;
};

export function generateTransactionRef(): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `CU-TXN-${stamp}-${rand}`;
}

export function formatCardDisplay(card: CardDetails): string {
  if (card.last4) return `•••• •••• •••• ${card.last4}`;
  if (card.number) return `•••• •••• •••• ${card.number.slice(-4) || "0000"}`;
  return "•••• •••• •••• ****";
}
